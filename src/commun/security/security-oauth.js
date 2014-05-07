/**
 * Created by guillemette on 11/03/14.
 */

    var state;

    var objectToQueryString = function(obj) {
        var str = [];
        angular.forEach(obj, function(value, key) {
            str.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
        });
        return str.join("&");
    };

    var formatPopupOptions = function(options) {
        var pairs = [];
        angular.forEach(options, function(value, key) {
            if (value || value === 0) {
                value = value === true ? 'yes' : value;
                pairs.push(key + '=' + value);
            }
        });
        return pairs.join(',');
    };

    angular.module('fwk-security.oauth', ['fwk-security', 'fwk-services', 'LocalStorageModule'])

        .factory('oauthService', ['$http', '$log', '$q', '$window', '$rootScope', 'tokenService', 'FWK_CONSTANT', 'UUID',
            function ($http, $log, $q, $window, $rootScope, tokenService,FWK_CONSTANT, UUID) {

                var oauthRequestInProgress = false;
                var oauthRetryQueue = [];

                var oauthService = {

                    /**
                     * Mise en oeuvre de la cinématique OAUTH sans popup : juste un appel de service !
                     * Les demandes de renouvellement du jeton sont mis en queue
                     * Une promise est systématiquement renvoyée pour faire patienter le demandeur
                     * Une fois le jeton récupéré les autres demandes en attente sont résolues
                     * @returns {*|Array|Object|Mixed|promise|the}
                     */
                    retrieveToken: function () {

                        $log.debug('OAUTHService retrieveToken()....');
                        //s'l n'y a pas de demande de renouvellement de jeton en cour...
                        if (!oauthRequestInProgress) {

                            oauthRequestInProgress = true;

                            $log.debug('\t OAUTHService retrieveToken() demande acceptée...');

                            //Préparation de la requete à envoyer pour récupérer le jeton
                            state = UUID.randomUUID();

                            if (FWK_CONSTANT.profile.toUpperCase()=== 'MOCK') {
                            	var tokenJWT = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJBUFBfVVNFUl9JRCI6IjM4OTRIIiwiQVBQX1VTRVJfUk9MRSI6WyJHRVNUSU9OTkFJUkUiXSwiQVBQX0NMSUVOVF9ST0xFIjpbIlJFQUQiLCJXUklURSJdLCJleHAiOjEzOTU4MTk3NTcsImF1ZCI6InVybjpjZGM6cmV0cmFpdGU6Y2xpOnJlc3Q6MS4wLCB1cm46Y2RjOnJldHJhaXRlOnNldDAxOnJlc3Q6MS4wIiwiaXNzIjoidXJuOmNkYzpjb25mbnVtOmlkcDphdXRoMiIsInN1YiI6InVybjpjZGM6cmV0cmFpdGU6ZXNnOmlobToxLjAiLCJpYXQiOjEzOTU4MTYxNTd9.1tnRB0ENn21zLvKdASQzSEzTfde0xCJYpuy0wZj7_RQ";
                            	tokenService.storeLocalToken(tokenJWT);
                            	oauthRequestInProgress = false;
                            	return $q.when(tokenService.getLocalToken());
                            }

                            var queryString = angular.extend(FWK_CONSTANT.oauth.queryStringParameters, {state: state});
                            var url =FWK_CONSTANT.idpBaseUrl + '/oauth2/auth?' + objectToQueryString(queryString);

                            return $http.get(url).then(
                                //success
                                function(accessTokenResponse) {

                                    // stockage du jeton
                                    tokenService.storeLocalToken(accessTokenResponse.data.token);

                                    //Libération des éventuelmles demandes en attentes
                                    angular.forEach(oauthRetryQueue, function(requetInProgress) {
                                            $log.debug('\t OAUTHService retrieveToken() demande resolue');
                                            //On résoud la promise en attente
                                            //On retourne le jeton à l'appelant
                                            requetInProgress.resolve(tokenService.getLocalToken());
                                        }
                                    );
                                    oauthRequestInProgress = false;

                                    return tokenService.getLocalToken();
                                },
                                //error
                                function(reason) {
                                    angular.forEach(oauthRetryQueue, function(requetInProgress) {
                                            $log.debug('\t OAUTHService retrieveToken() demande rejetée');
                                            //On rejette la promise en attente
                                            requetInProgress.reject(reason);
                                        }
                                    );
                                    //on repropage l'ano
                                    //attention la remontée sous la forme $q.reject(reason) ne marche pas !
                                    throw reason;

                                }

                            );

                        } else {
                            //les autres demandes qui pourraient arriver sont conservées
                            //une promise est renvoyée afin de faire patienter les demandeurs
                            //ces promises seront résolues une fois que la première demande aura été résolue
                            $log.debug('\t OAUTHService retrieveToken() demande mise en attente...');
                            var deferred = $q.defer();
                            oauthRetryQueue.push(deferred);
                            return deferred.promise;
                        }

                    },

                    // Mise en oeuvre de la cinématique OAUTH avec une popup...
                    retrieveTokennByPopup: function (extraParams, popupOptions) {

                        popupOptions = angular.extend({
                            name: 'AuthPopup',
                            openParams: {
                                width: 1010,
                                height: 500,
                                resizable: false,
                                scrollbars: true,
                                status: false
                            }
                        }, popupOptions);

                        var waitFormAccessToken = $q.defer();
                        state = UUID.randomUUID();
                        var queryString = angular.extend(FWK_CONSTANT.oauth.queryStringParameters, {state: state});
                        var url =FWK_CONSTANT.idpBaseUrl + '/oauth2/auth?' + objectToQueryString(queryString);

                        var popup = window.open(url, popupOptions.name, formatPopupOptions(popupOptions.openParams));

                        // ATTENTION JQuery a pris la main sur l'event
                        angular.element($window).bind('message', function(event) {

                            if (event.originalEvent.source == popup && event.originalEvent.origin == window.location.origin) {
                                popup.close();
                                $rootScope.$apply(function() {
                                    if (event.originalEvent.data.access_token) {
                                        // stockage du jeton
                                        tokenService.storeLocalToken(event.originalEvent.data.access_token);
                                        waitFormAccessToken.resolve(event.originalEvent.data);
                                    } else {
                                        //TODO à revoir la gestion de l'ano
                                        waitFormAccessToken.reject(event.originalEvent.data);
                                    }
                                });
                            }

                        });

                        // TODO: reject deferred if the popup was closed without a message being delivered + maybe offer a timeout
                        return waitFormAccessToken.promise;
                    }

                };
                return oauthService;
            }])

        .factory('tokenService', ['$log', '$q', 'FWK_CONSTANT', 'localStorageService',
            function ($log, $q,FWK_CONSTANT, localStorageService) {

                var tokenService = {

                    storeLocalToken : function(accessToken) {
                        //$log.debug('\t OAUTH TOKEN storeLocalToken()....');
                        var tokenStorage = {
                            accessToken : accessToken,
                            state: state,
                            dateCreated: new Date().getTime()
                        };
                        localStorageService.set(FWK_CONSTANT.oauth.accessToken.keyname, tokenStorage);
                    },

                    getLocalToken : function() {
                        //$log.debug('\t OAUTH TOKEN getLocalToken()....');
                        var tokenStorage = localStorageService.get(FWK_CONSTANT.oauth.accessToken.keyname);
                        if (tokenStorage === null) {
                            return "";
                        } else {
                            return tokenStorage.accessToken || $q.when(tokenStorage.accessToken);
                        }
                    },

                    clearLocalToken : function() {
                        //$log.debug('\t OAUTH TOKEN clearLocalToken()....');
                        localStorageService.remove(FWK_CONSTANT.oauth.accessToken.keyname);
                    },

                    getUUID : function() {
                        if (state === null || angular.isUndefined(state) ) {
                            return 'n/a';
                        } else {
                            return state;
                        }
                    }
                };
                return tokenService;
            }]);
