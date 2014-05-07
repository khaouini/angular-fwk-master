
    angular.module( 'fwk-common-uc',
    	['ui.router',
         'fwk-services',
         'fwk-security'
    ])

    .config(function config( $stateProvider ) {

      $stateProvider

        ////////////
        // Error //
        ////////////

        .state('error', {
          url: '/error',
          templateUrl: 'commun/fwk-error.tpl.html',
          controller: 'fwkErrorCtrl',
          data:{ pageTitle: 'Erreur' }
        })

        //////////////////
        // Unauthorized //
        //////////////////

        .state('unauthorized', {
            // Use a url of "/" to set a states as the "index".
            url: '/unauthorized',
            template: '<p class="lead">Vous n\'êtes pas habilité à accéder à cette ressources !</p>' +
                '<p>Cliquez <a href="#/start">ici</a> pour vous ré-authentifier ou utiliser le bouton <i class="glyphicon glyphicon-arrow-left"></i> <i>Back</i> du navigateur pour revenir à la page précédente</p>',
            data:{ pageTitle: 'Non Habilité ! ' }
        });

    })

    .controller('fwkErrorCtrl', ['$scope', 'stackFault', 'i18nNotifications', 'authentService', 'httpLogger',
      function ($scope, stackFault, i18nNotifications, authentService, httpLogger) {

        $scope.currentUser = null;
        $scope.calls = [];

        //Sauvegarde des infos sur l'utilisateur courant avant de le déconnecter
        angular.copy(authentService.currentUser, $scope.currentUser);

        //obtention de la liste des accès HTTP
        angular.copy(httpLogger.getLogs(), $scope.calls);

        //obtention du détail de l'erreur rencontrée
        $scope.error = stackFault.getError();

        $scope.headers = [];
        angular.forEach($scope.error.reasonOrigin.config.headers, function(key, value) {
        	$scope.headers.push(value + ' : ' + key);
        });

        // reset des notifs éventuellement posées
        i18nNotifications.removeAll();

        // fin de la session en cours
        authentService.logout();

    }]);