/**
 * Created by guillemette on 11/03/14.
 */

    /**
     * Cette fonction parcours une liste de pattern et vérifie si l'URL fournie apparient a cette liste
     * @param url
     * @param whiteList
     * @returns {boolean}
     */
    var checkWhiteList = function (url, whiteList) {
        var pattern;
        for (var i = 0; i < whiteList.length; i++) {
            pattern = new RegExp(whiteList[i]);
            if (pattern.test(url)) {
                return true;
            }
        }
        return false;
    };


    angular.module('fwk-security.interceptor', ['fwk-security', 'fwk-services'])

        .factory('requestSecurityInterceptor', ['$injector', '$q', '$log', 'localizedMessages', 'dateFilter', 'restFault', 'invalidCredentialFault', 'FWK_CONSTANT', 'tokenService', 'httpLogger',
            function ($injector, $q, $log, localizedMessages, dateFilter, restFault, invalidCredentialFault,FWK_CONSTANT, tokenService, httpLogger) {

	            var requestInterceptor = {

                    'request': function(config) {

                        var now = new Date();
                        config.requestTimestamp = now.getTime();

                        //Seules certaines URL sont à protéger systématiquement par un jeton JWT...
                        if (checkWhiteList(config.url,FWK_CONSTANT.oauth.whitelist.request )) {
                            // si l'URL appartient à la white list, pas d'ajout de jeton JWT sur l'appel
    //                        $log.debug ('\t Pas de token pour URL : ' + config.url);
                        } else {
                            //...sinon ajout du jeton JWT systématiquement
                           config.headers = config.headers || {};
                           config.headers.Authorization = 'Bearer ' + tokenService.getLocalToken();
                        }
                        config.headers['X-RequestID'] = tokenService.getUUID();

                        var callLog = localizedMessages.get('trace.request.msg', {
                            dateTime : dateFilter(now, 'dd/MM/yyyy HH:mm:ss'),
                            uuid:  config.headers['X-RequestID'],
                            url: config.url
                        });

                        httpLogger.pushLog(callLog);

                        return config;
                    }

                };

	            return requestInterceptor;
            }
        ])

        .factory('responseSecurityInterceptor', ['$injector', '$q', '$log', 'dateFilter', 'localizedMessages', 'restFault', 'invalidCredentialFault', 'FWK_CONSTANT', 'tokenService', 'httpLogger', 'fieldValidationFault', 'resourceNotFoundFault',
            function ($injector, $q, $log, dateFilter, localizedMessages, restFault, invalidCredentialFault,FWK_CONSTANT, tokenService, httpLogger, fieldValidationFault, resourceNotFoundFault) {


	            var pushTrace = function(response, status) {

	                var now = new Date();
	                var timeElapsed = (now.getTime() - response.config.requestTimestamp) / 1000;

	                var callLog = localizedMessages.get('trace.response.msg', {
	                    dateTime : dateFilter(now, 'dd/MM/yyyy HH:mm:ss'),
	                    uuid:  response.config.headers['X-RequestID'],
	                    url: response.config.url,
	                    delay: timeElapsed,
	                    type : status,
	                    status: response.status
	                });

	                httpLogger.pushLog(callLog);
	            };

                var throwException = function(response) {
                    var msgErreur, fault;
                    msgErreur = localizedMessages.get('resource.error.server', {resourcename: response.config.url});
                    fault = restFault(msgErreur, response);
                    throw fault;
                };

	            /**
	             * Traitement réalisé si HTTP 400 Bad Request
	             * Structure normalisée
	             * exemple
	             * {"typeError":"FIELD_VALIDATION_ERROR",
	             *    "fieldErrors":[
	             *       {"fieldname":"nom","message":"La taille du champ nom doit &amp;ecirc&#x3b;tre comprise entre 3 et 30 caract&amp;egrave&#x3b;res","type":"Size"},
	             *       {"fieldname":"adresse","message":"La taille du champ adresse doit &amp;ecirc&#x3b;tre comprise entre 5 et 50 caract&amp;egrave&#x3b;res","type":"Size"}
	             *    ]
	             * }
	             * La fonction lève une fieldValidationFault qui devra être traitée par la couhce présentation, ie le controller
	             */
	            var process400 = function(response) {
	                // HTTP 400 Bad Request
	                $log.debug('\t...400 Bad Request detected');

	                var msgErreur, fault;

	                if (response.data && response.data.typeError === 'FieldValidationFault') {
	                    msgErreur = localizedMessages.get('resource.validation.error.server', {});
	                    fault = fieldValidationFault(msgErreur, response.data);
	                    return $q.reject(fault);
	                } else {
                        return throwException(response);
	                   //TODO Factoriser les 3 lignes ci-dessous
	                   //msgErreur = localizedMessages.get('resource.error.server', {resourcename: response.config.url});
	                   //fault = restFault(msgErreur, response);
	                   //throw fault;
	                }
	            };

	            var process401 = function(response) {

	                // HTTP 401 Unauthorized
	                $log.debug('\t...401 detected');

	                //var msgErreur, fault;

	                //Un 401 pour une mire d'authent est normale (invalid login/password, ...), pour les autres on renégocie un jeton
	                if (checkWhiteList(response.config.url, FWK_CONSTANT.oauth.whitelist.response)) {

	                    // pour les whites list (ex mire de login) on laisse l'erreur se progager et remontée vers la couche appelante
	                    if (response.data === 'Unauthorized') {
	                        return $q.reject(invalidCredentialFault(localizedMessages.get('login.error.invalidCredentials', {})));
	                    } else {
	                        //l'erreur est plus sérieuse
	                        return $q.reject(restFault(localizedMessages.get('resource.error.server', {resourcename: response.config.url}), response));
	                    }

	                } else {

	                    var $http = $injector.get('$http');
	                    var oauthService = $injector.get('oauthService');

	                    // HTTP 401 pris en charge :
	                    //   - pas de jeton envoyé
	                    //   - jeton expiré
	                    // Attention HTTP 401 invalid_token n'est pris en charge que dans le cas d'un jeton expriré...pour les autres
	                    // cas (jetons non valides, pb signature, mal formés) ils remontent en anos graves
	                    if ((response.data.error.code === 'invalid_token' && response.data.error.message === 'jwt expired') ||
	                         response.data.error.code === 'credentials_required') {

	                        $log.debug('\t...demande de renouvellement du jeton');
	                        //renvoi d'une promise avec récup du jeton + ressoumission de la requette
	                        return oauthService.retrieveToken()
	                                .then(function (token) {
	                                    var newConfig = response.config;
	                                    newConfig.headers.Authorization = 'Bearer ' + token;
	                                    return $http(newConfig);
	                                });
	                    } else {
                            return throwException(response);
	                        //msgErreur = localizedMessages.get('resource.error.server', {resourcename: response.config.url});
	                        //fault = restFault(msgErreur, response);
	                        //throw fault;
	                    }
	                }

	            };

                /**
                 * Traitemùent réalisé si le servoce retourne une HTTP 404 not found
                 * Deux cas de figure :
                 *    1. l'URI employée n'existe pas : erreur technique ==> on doit renvoyer l'utilisateur vers une page d'erreur
                 *    2. L'URI employée est correcte mais la la recherche applicative de la ressource se solde par un échec. La ressource demandée n'a pu être trouvée.
                 *    ==> Dans ce cas, on renvoit une exception au service pour qu'il le remonte au niveau de l'IHM pour affichage de l'info.
                 * @param response
                 * @returns {Promise}
                 */
                var process404 = function(response) {

                    // HTTP 404 Not Found
                    $log.debug('\t...404 Not Found detected');

                    var msgErreur, fault;

                    if (response.data && response.data.typeError === 'ResourceNotFoundFault') {
                        msgErreur = localizedMessages.get('resource.not.found', {messageFromserver: response.data.message || 'Ressource non trouvée !'});
                        fault = resourceNotFoundFault(msgErreur, response.data);
                        return $q.reject(fault);
                    } else {
                        return throwException(response);
                        //TODO Factoriser les 3 lignes ci-dessous
                        //msgErreur = localizedMessages.get('resource.error.server', {resourcename: response.config.url});
                        //fault = restFault(msgErreur, response);
                        //throw fault;
                    }
                };


                var responseInterceptor = {

                	// 20x
                	// 304 Not modified (a noter : code retour 200 pour angularjs)
                    'response': function(response) {

                    	pushTrace(response, 'SUCCESS');
                        return response || $q.when(response);
                    },

                    'responseError': function(response) {

                        //si plantage en d'un problème Javascript...
                        if (response instanceof Error) {
                            throw response;
                        }  else {

                        	pushTrace(response, 'ERROR');

                        	 switch (response.status)
                             {
                                 case 400:
                                     return process400(response);
                                 case 401:
                                     return process401(response);
                                 case 404:
                                     return process404(response);
                                 default:
                                     var msgErreur = localizedMessages.get('resource.error.server', {resourcename: response.config.url});
                                     throw restFault(msgErreur, response);
                             }

                        }

                    }
                };

                return responseInterceptor;

            }]);
