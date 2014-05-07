
angular.module('fwk-services.localizedMessages', ['fwk-i18n.messages'])

      .factory('localizedMessages', ['$interpolate', 'I18N.MESSAGES', function ($interpolate, i18nmessages) {

        var handleNotFound;
        handleNotFound = function (msg, msgKey) {
          return msg || '?' + msgKey + '?';
        };

        return {
          get: function (msgKey, interpolateParams) {
            var msg = i18nmessages[msgKey];
            if (msg) {
              return $interpolate(msg)(interpolateParams);
            } else {
              return handleNotFound(msg, msgKey);
            }
          }
        };
      }]);
