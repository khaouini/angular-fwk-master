(function ( window, angular ) {


    // Exemple 1 de chargement manuel de bootstrap
    // La configuration de l'application et du FWK est récupérée via un appel REST.
    // Donne lieu à la création de deux CONSTANT au sens AngularJS
    // A COMMENTER si le chargement de ces variables s'opère par des variables Javascript (cf exemple 2)
    angular.element(document).ready(function() {

        var initInjector = angular.injector([ 'ng' ]);
        var $http = initInjector.get('$http');

        $http.get("http://localhost:3000/configuration").then(function(response) {
            var parametres = response.data;
            angular.module('my-app.config', [])
                .constant('STATS_SPS_CONSTANT', parametres.app_constant)
                .constant('FWK_CONSTANT', parametres.fwk_constant);
            angular.bootstrap(document, [ 'my-app' ]);
        });
    });

    //Exemple 2 de chargement ou cette fois-ci la page index.html renvoyée par le serveur positionne
    // des vraiables Javascript pré-valorisées
    // A COMMENTER si ce scénario n'est pas retenu
    angular.module('statsSps.config', [])
        .config(['$provide',
            function ($provide) {

                $provide.constant('FWK_CONSTANT', window.myActiveConfig.fwk_constant);
                $provide.constant('STATS_SPS_CONSTANT', window.myActiveConfig.app_constant);

            }]);


	angular.module('my-app', [
      'my-app.config',
	  /* module angular resource pour la gestion des entites */
	  'ngResource',
	  /* module angular UI route */
	  'ui.route',
      /* local storage utillsé par l'application ou le socle DEI */
      'LocalStorageModule',
      /* Module embarquant la déclaration  de tous les modules du FWK */
      'fwk-angular.bootstrap'
	])

    .config(['localStorageServiceProvider', 'STATS_SPS_CONSTANT',
        function (appLocalStorageServiceProvider, STATS_SPS_CONSTANT) {
            appLocalStorageServiceProvider.setPrefix(STATS_SPS_CONSTANT.prefix + "-" + STATS_SPS_CONSTANT.version);
            appLocalStorageServiceProvider.setStorageType('sessionStorage');
    }])

    /** Exemple de configuration à reporter sans le fichier du projet*/
	.run(['$rootScope', '$state', '$stateParams', '$log', '$locale', 'authentService', 'i18nNotifications', 'FWK_CONSTANT',
      function ($rootScope, $state, $stateParams, $log, $locale, authentService, i18nNotifications, FWK_CONSTANT) {

        //Authentification silencieuse aprés cinématique OAUTH2 dans laquelle l'utilisateur doit
        //être authentifié pour accéder au lanceur de l'application
        // A COMMENTER si l'application gère sa propre page de login ou utilise une popup pour sa cinématique OAUTH
        authentService.silentLogin(window.myActiveProfile, window.myAccessToken, window.mySessionID);

        $log.debug('Démarrage application...run');
        $log.debug('$locale.id : ' + $locale.id);
        $log.debug('x_session_id : ' + window.mySessionID);
        $log.debug('access_token : ' + window.myAccessToken);


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

})( window , window.angular );
