
    angular.module('fwk-services.handler-exception', ['fwk-services.error', 'fwk-services.localizedMessages'])

      .factory('exceptionHandlerFactory', ['$injector', function($injector) {

            return function($delegate) {

              return function (exception, cause) {

                // Lazy load notifications to get around circular dependency
                //Circular dependency: $rootScope <- notifications <- i18nNotifications <- $exceptionHandler
                var stackFault = $injector.get('stackFault');

                stackFault.setError(exception);

                $delegate(exception, cause);

              };
            };
          }])

      .config(['$provide', function($provide) {

        $provide.decorator('$exceptionHandler', ['$delegate', 'exceptionHandlerFactory', function ($delegate, exceptionHandlerFactory) {
          return exceptionHandlerFactory($delegate);
        }]);

      }]);
