
    var PROFILE_ENABLE = ['MOCK', 'MOCK-REST', 'NORMAL'];

	angular.module('fwk-bootstrap', [
      /* module crée au chargement de l'application (index.html) après récupération des donnèes auprès du serveur */
        /* ce module contient les configs du proejt "<PROJET>_CONSTANT" ey du socle "FWK_CONSTANT"
      '<nom du module>.config',
	  /* module angular resource pour la gestion des entites */
	  'ngResource',
	  /* module angular UI route */
	  'ui.route',
  	  /* modules dédiés à la sécurité */
	  'fwk-security',
	  /* modules utilitaires */
	  'fwk-services',
	  'fwk-i18n.messages',
	  'fwk-directives',
	  /* modules de scenarios commun (controler, ...) */
      'fwk-common-state-uc',
	  /* template html sous forme de js */
	  'fwk-templates',
	  /* local storage pour le stockage du jeton jwt */
	  'LocalStorageModule'
	])

    /** Exemple de configuration qui sera renvoyée rpar le service de configuration du projet */
/**	.constant('FWK_CONSTANT', {
	      version: '0.0.4',
	      profile: PROFILE_ENABLE[0],
          unauthorizedState: 'unauthorized',
          errorState: 'error',
	      idpBaseUrl: 'http://localhost:3001',
          mockPathBase: 'src/',
	      oauth: {
              profilEndpoint: '/oauth2/userinfo',
              authorizeEndpoint : '/oauth2/authorize',
              queryStringParameters : {
                  response_type: 'token',
                  client_id : 'gkCYi5AkJPsa7XKNfOV4uydYyz4',
                  redirect_uri : 'http://localhost:63342/EspaceGestionnaire/app/oauth2Callback.html',
                  scope : 'urn:cdc:retraite:cli:rest:1.0, urn:cdc:retraite:set01:rest:1.0'
              },
	          accessToken : {
	              prefix : 'FWK_0.0.2',
	              keyname : 'ACCESS_TOKEN'
	          },
	          whitelist : {
	            // pas  d'ajout de jeton JWT pour ces urls
	            request : ['\\/idp\\/login','\\/idp\\/logout', '\\/oauth2\\/auth', '\\w+\\.tpl.html$', '\\w+\\.json$'],
	            // pas de traitement particulier (401) pour ces url
	            response: ['\\/idp/login']
	          }
	      },
          http: {
              authenticationEndpoint: '/idp/login',
              profilEndpoint: '/users/profil',
              logoutEndpoint : '/idp/logout'
          },
	      trace : {
	          MAX_HISTORY_SIZE: 30
	      }
	})
*/
        // Configuration des interceptors et des mpodules utilisés par le Socle AngularJS
	.config(['$httpProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider', 'localStorageServiceProvider', 'FWK_CONSTANT',
      function ($httpProvider, $stateProvider, $urlRouterProvider, $locationProvider, localStorageServiceProvider, FWK_CONSTANT) {

		$locationProvider.html5Mode(false);

		localStorageServiceProvider.setPrefix(FWK_CONSTANT.oauth.accessToken.prefix);
        localStorageServiceProvider.setStorageType('sessionStorage');

        $httpProvider.interceptors.push('requestSecurityInterceptor');
        $httpProvider.interceptors.push('responseSecurityInterceptor');

	}])

    /** Exemple de configuration à reporter sans le fichier du projet*/
	.run(['$rootScope', '$state', '$stateParams', '$log', '$locale', 'authentService', 'i18nNotifications', 'FWK_CONSTANT',
      function ($rootScope, $state, $stateParams, $log, $locale, authentService, i18nNotifications, FWK_CONSTANT) {

		$log.debug('Démarrage application...run');
		$log.debug('Locale : ' + $locale.id);

		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;

		$rootScope.now = new Date();

		$rootScope.profile = FWK_CONSTANT.profile;

		/** Fonctions communes - FORMULAIRE*/
		$rootScope.showError = function (ngModelController, error) {
			return ngModelController.$error[error] && ngModelController.$dirty;
		};

		$rootScope.getCssClasses = function (ngModelContoller) {
			return {
				'has-error': ngModelContoller.$invalid && ngModelContoller.$dirty,
				'has-success': ngModelContoller.$valid && ngModelContoller.$dirty
			};
		};

		$rootScope.pageTitle = "Page Principale";


	    $rootScope.$on('$stateChangeStart',
	      function (event, toState, toParams, fromState, fromParams) {

	      $log.debug('$stateChangeStart from ' + fromState.name + '(' + fromParams + ') to ' + toState.name + '(' + toParams +')');

          //Vérification existance d'une règle controllant la vérification des habilitations
	      if (angular.isUndefined(toState.data) || !angular.isFunction(toState.data.rule)) {
	        return;
	      }

          //vérification des habilitations pour accéder à la page demandée...
          // Pour se faire on se base sur la présenced'une fonction "rule" au niveau de l'objet data de l'état
	      var result = toState.data.rule(authentService.currentUser, authentService);

          //Si pas les droits suffisants...
	      if (!result) {
	        event.preventDefault();
	        i18nNotifications.pushForNextRoute('errors.route.unAuthorized', 'danger', {}, {});

	       if (fromState.abstract ||  fromState.name==='') {
	          $state.go(FWK_CONSTANT.unauthorizedState);
	        } else {
	          //retour sur l'écran précédent + force le reload de la page pour générer l'evenement stateChangeSuccess pour purger la liste des notifications
	          $state.go(fromState.name, {}, {notify:true, reload: true});
	        }
	      }

	    });

	    $rootScope.$on('$stateChangeSuccess',
	      function (event, toState, toParams, fromState, fromParams) {
	        $log.debug('$stateChangeSuccess from '+ fromState.name + '(' + fromParams + ') to ' +toState.name + '(' + toParams +')');
	        //Bascule des notification "NEXT ROUTE" en "CURRENT ROUTE" pour qu'ils s'affichent sur la page
	        i18nNotifications.onStateChangeSuccess();
	        if ( angular.isDefined( toState.data.pageTitle ) ) {
	            $rootScope.pageTitle = toState.data.pageTitle;
	        }
	      });

	    // en cas de problème (javascript, accès aux services)
	    // si le service lève une exception, elle est dispo au niveau du paramètre error
	    $rootScope.$on('$stateChangeError',
	      function (event) {
	        $log.debug('$stateChangeError');
	        event.preventDefault();
	        $state.go(FWK_CONSTANT.errorState);
	      });
	}]);
