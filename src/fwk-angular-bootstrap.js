/**
 * Created by guillemette on 29/08/2014.
 */

angular.module('fwk-angular.bootstrap', [
    /* module FWK dédiés à la sécurité */
    'fwk-security',
    /* module FWk Services Communs  */
    'fwk-services',
    /* directives du FWK */
    'fwk-directives',
    /* modules des scenarios IHM communs (controler, ...) */
    'fwk-common-state-uc',
    /* templates html des scénarios IHM communs sous forme de js */
    'fwk-templates',
    /* local storage pour le stockage du jeton jwt */
    'LocalStorageModule'
    ])

    // Attention l'application DEVRA imperativement charger manuellement ANGULARJS après avoir récupèré la configuration de l'appli et du FWK via
    // les appels REST adéquats

    // Configuration des interceptors et des modules utilisés par le Socle AngularJS DEI
    .config(['$httpProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider',
        function ($httpProvider, $stateProvider, $urlRouterProvider, $locationProvider) {

            $locationProvider.html5Mode(false);

            //ATTENTION : l'initialisation et la configuration du localStorageService devra etre opéré par l'application client
//            fwkLocalStorageServiceProvider.setPrefix(FWK_CONSTANT.oauth.accessToken.prefix);
//            fwkLocalStorageServiceProvider.setStorageType('sessionStorage');

            $httpProvider.interceptors.push('requestSecurityInterceptor');
            $httpProvider.interceptors.push('responseSecurityInterceptor');

        }]);