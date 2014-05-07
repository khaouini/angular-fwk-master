/**
 * Created by guillemette on 12/03/14.
 */


    angular.module('fwk-services.httpLogger', [])

    .factory('httpLogger', ['$log', 'FWK_CONSTANT',
      function ($log, FWK_CONSTANT) {

        var calls = [];

        return {

          pushLog : function(log) {
              $log.debug(log);
              if (calls.push(log) > FWK_CONSTANT.trace.MAX_HISTORY_SIZE) {
                  calls.shift();
              }
          },

          getLogs : function() {
            var callsBackup=[];
            angular.copy(calls, callsBackup);
            return callsBackup;
          },

          clearLogs : function() {
              calls.length = 0;
          }
        };

      }]);
