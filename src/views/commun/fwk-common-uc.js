
    angular.module( 'fwk-common-uc',
    	['fwk-services',
         'fwk-security'
    ])

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
        if ($scope.error.reasonOrigin) {
            angular.forEach($scope.error.reasonOrigin.config.headers, function (key, value) {
                $scope.headers.push(value + ' : ' + key);
            });
        }

        // reset des notifs éventuellement posées
        i18nNotifications.removeAll();

        // fin de la session en cours
        authentService.logout();

    }]);