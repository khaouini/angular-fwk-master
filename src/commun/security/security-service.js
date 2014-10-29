/**
 * Created by guillemette on 11/03/14.
 */
    angular.module('fwk-security.service', ['fwk-services', 'fwk-security'])

        .factory('authentService', ['$http', '$q', '$log', '$rootScope', 'userService', 'localizedMessages', 'FWK_CONSTANT', 'Base64', 'tokenService', 'oauthService', 'invalidCredentialFault','dateFilter', 'UUID',
            function ($http, $q, $log, $rootScope, userService, localizedMessages,FWK_CONSTANT, Base64, tokenService, oauthService, invalidCredentialFault, dateFilter, UUID) {

            var processLogin = function (login, password)  {

                var path, request, headerAuth, token;

                if (FWK_CONSTANT.profile.toUpperCase() === 'MOCK') {

                    if (login.toUpperCase()!=='JDOE' || password.toUpperCase() !== 'PASSWORD') {
                        var fault = invalidCredentialFault(localizedMessages.get('login.error.invalidCredentials', {}));
                        return $q.reject(fault);
                    }

                	path = FWK_CONSTANT.mockPathBase + 'commun/security/mock/user.json';
                	headerAuth = {};
                	request = $http.get(path, angular.extend({cache: false}, headerAuth));
                } else {
                    path =FWK_CONSTANT.idpBaseUrl + FWK_CONSTANT.http.authenticationEndpoint;
                    token =  'Basic ' + Base64.encode(login + ':' + password);
                    headerAuth = {headers: {'Authorization': token} };
                    request = $http.post(path,  {}, angular.extend({cache: false}, headerAuth));
                }

                return request.then(
                    //success
                    function (response) {
                        authentService.currentUser = userService(response.data);
                        return authentService.currentUser;
                    },
                    //failure
                    function(reason) {
                        // on remonte l'exception préparée par l'interceptor remonte
                        throw reason;
                    }
                );
            };

            // Cette fonction est utilisée dans la cinématique OAUTH + poppup.
            // Une fois le jeton récupéré cet appel permet de récupérer le profil de l'utilisateur
            var getProfile = function ()  {

              var path, request;

              //TODO
              //if (FWK_CONSTANT.profile.toUpperCase()=== 'MOCK') {
            	path = FWK_CONSTANT.mockPathBase + 'commun/security/mock/user.json';
              //} else {
              //  path =FWK_CONSTANT.idpBaseUrl + FWK_CONSTANT.oauth.profilEndpoint;
              //}

              request = $http.get(path, {cache: false});

              return request.then(
                //success
                function (response) {
                  authentService.currentUser = userService(response.data);
                  return authentService.currentUser;
                },
                //failure
                function(reason) {
                  // on remonte l'exception préparée par l'interceptor avant
                  throw reason;
                }
              );
            };

            var processLogout = function() {

                var path, request;

                if (FWK_CONSTANT.profile.toUpperCase()=== 'MOCK') {
                	path = FWK_CONSTANT.mockPathBase + 'commun/security/mock/logout.json';
                	request = $http.get(path, {cache: false});
                } else {
                    path =FWK_CONSTANT.idpBaseUrl + FWK_CONSTANT.http.logoutEndpoint;
                    request = $http.post(path, {},{cache: false});
                }

                return request.then(
                    //success
                    function (response) {
                        return response.data.timestamp;
                    },
                    //failure
                    function(reason) {
                        // on remonte l'exception préparée par l'interceptor avant
                        throw reason;
                    }
                );

            };

            var processAfterLogout = function (timestamp) {

                //supression du jeton local
                tokenService.clearLocalToken();

                // reset de l'utilisateur connecté
                authentService.resetCurrentUser();

                var msg = localizedMessages.get('logout.success.msg', {dateTime : dateFilter(timestamp, 'dd/MM/yyyy HH:mm:ss')});
                return $q.when(msg);
            };

            // The public API of the service
            var authentService = {

                // Délégation de l'authent à l'IDP via une popup
                loginWithIDP: function() {
                    return oauthService.retrieveTokennByPopup({},{})
                        .then( getProfile);
                },

                // Attempt to authenticate a user by the given login and password
                // si mire de login embarquée dans l'appli angular
                login: function (login, password) {
                    return processLogin(login, password)
                        .then( oauthService.retrieveToken);
                  },

                // Cinématique prise en charge par IDP OAUTH sans besoin de popup
                // L'application redirige d'abod l'utilisateur vers l'IDP (URL implicit flow forgée par le serveur)
                // qui lui propose une mire aux couleurs du projet. Une fois authentifié, la page de callback est appelée.
                // Cette dernière extrait l'access token puis appelle immédiatement l'application afin de récupérer le
                // lanceur de l'application. L'appliaction renvoi la page du lanceur si et seulement si l'acces token envoyé
                // est valide ! Ce qui implique que seuls les utilisateurs authentifiés ont acces au coeur applicatif. A noter
                // que le lanceur (fragment html) contient des varaiobles javascript reprenant le profile de l'utilisateur,
                // l'access token, un identifiant des session et le paramétrage de l'application (ce qui évite des appels rest inutil) !
                // Dans cette cinématique, la phase de login consiste donc simplement à enregistrer le jeton et à positionner le profile de l'utiliteur.

                silentLogin: function (activeProfile, accessToken, sessionID) {

                    // Controle paramètre activeProfile
                    if (! angular.isObject(activeProfile)) {
                        throw invalidCredentialFault(localizedMessages.get('active.profile.not.found', {}));
                    }

                    //Controle du paramètre accessToken
                    if( (typeof accessToken == "undefined") ||
                        (accessToken == null ) ||
                        (typeof accessToken.valueOf() != "string") ||
                        (accessToken.length == 0)) {
                        throw invalidCredentialFault(localizedMessages.get('access.token.not.found', {}));
                    }

                    if ( (typeof sessionID == "undefined") || (sessionID == null) ) {
                        // on génère un sessionID si non fourni par défaut !
                        sessionID = UUID.randomUUID();
                    }

                    //Pour des raisons de facilité le sessionId est stocké au niveau de la conf du framework
                    angular.extend(FWK_CONSTANT, {'x_session_id': sessionID});

                    // conservation du profile utilisateur
                    this.currentUser = activeProfile;

                    //stockage du jeton de sécurité
                    tokenService.storeLocalToken(accessToken);

                },

                // Logout the current user and redirect
                logout: function () {
                    return processLogout()
                        .then(processAfterLogout);
                },

                resetCurrentUser: function() {
                    authentService.currentUser = null;
                },

                // Information about the current user
                currentUser: null,

                // Is the current user authenticated?
                isAuthenticated: function () {
                    return !!authentService.currentUser;
                }

            };

            return authentService;

        }]).
        factory('securityUtils', function () {

            return {

                // Util for finding an object by its 'id' property among an array
                findByRole: function findByRole(a, role) {
                    for (var i = 0; i < a.length; i++) {
                        if (a[i].toString() === role) {
                            return true;
                        }
                    }
                    return false;
                }
            };

        });
