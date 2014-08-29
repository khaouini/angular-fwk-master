
    // Exemple de chargement manuel de bootstrap
    // La configuration de l'application et du FWK est récupérée via un appel REST.
    // Donne lieu à la création de deux CONSTANT au sens AngularJS
    angular.element(document).ready(function() {

        var initInjector = angular.injector([ 'ng' ]);
        var $http = initInjector.get('$http');

        $http.get("http://localhost:3000/configuration").then(function(response) {
            var parametres = response.data;
            angular.module('statsSps.config', [])
                .constant('STATS_SPS_CONSTANT', parametres.app_constant)
                .constant('FWK_CONSTANT', parametres.fwk_constant);
            angular.bootstrap(document, [ 'statsSps' ]);
        });
    });

    // Exemple de profile
    //var PROFILE_ENABLE = ['DEBUG', 'MOCK', 'NORMAL'];


	angular.module('my-app', [
	  /* module angular resource pour la gestion des entites */
	  'ngResource',
	  /* module angular UI route */
	  'ui.route',
      /* Module embarquant la déclaration  de tous les modules du FWK */
      'fwk-angular.bootstrap'
	])

    // Exemple utilisation d'un localStorageServiceProvider différent pour l'application
    .config(['localStorageServiceProvider', 'STATS_SPS_CONSTANT',
        function (appLocalStorageServiceProvider, STATS_SPS_CONSTANT) {
            appLocalStorageServiceProvider.setPrefix(STATS_SPS_CONSTANT.prefix + "-" + STATS_SPS_CONSTANT.version);
            appLocalStorageServiceProvider.setStorageType('localStorage');
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
