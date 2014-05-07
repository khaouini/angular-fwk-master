/**
 * Created by guillemette on 11/03/14.
 */
    angular.module('fwk-security.service', ['fwk-services', 'fwk-security'])

        .factory('authentService', ['$http', '$q', '$log', '$rootScope', 'userService', 'localizedMessages', 'FWK_CONSTANT', 'Base64', 'tokenService', 'oauthService', 'invalidCredentialFault',
            function ($http, $q, $log, $rootScope, userService, localizedMessages,FWK_CONSTANT, Base64, tokenService, oauthService, invalidCredentialFault) {

            var processLogin = function (login, password)  {

                var path, request, headerAuth, token;

                if (FWK_CONSTANT.profile.toUpperCase() === 'MOCK') {

                    if (login.toUpperCase()!=='JDOE' || password.toUpperCase() !== 'PASSWORD') {
                        var fault = invalidCredentialFault(localizedMessages.get('login.error.invalidCredentials', {}));
                        return $q.reject(fault);
                    }

                	path ='src/commun/security/mock/user.json';
                	headerAuth = {};
                	request = $http.get(path, angular.extend({cache: false}, headerAuth));
                } else {
                    path =FWK_CONSTANT.idpBaseUrl + '/idp/login';
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

              if (FWK_CONSTANT.profile.toUpperCase()=== 'MOCK') {
            	path ='src/commun/security/mock/user.json';
              } else {
                path =FWK_CONSTANT.idpBaseUrl + '/users/profil';
              }

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
                	path ='src/commun/security/mock/logout.json';
                	request = $http.get(path, {cache: false});
                } else {
                    path =FWK_CONSTANT.idpBaseUrl + '/idp/logout';
                    request = $http.post(path, {},{cache: false});
                }

                //request = $http.post(path, {},{cache: false});

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

            var processAfterLogout = function () {

                //supression du jeton local
                tokenService.clearLocalToken();

                // reset de l'utilisateur connecté
                authentService.resetCurrentUser();

                return $q.when('logout.success.msg');
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
