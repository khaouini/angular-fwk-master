
    var UserDTOFactory = function (userData) {

        //les données sont private
        var data = angular.copy(userData);

        this.getFullname = function () {
            return data.firstname + ' ' + data.lastname;
        };

        this.isUserInRole = function (role) {
            for (var i = 0; i < data.roles.length; i++) {
              if (data.roles[i].toString() === role) {
                return true;
              }
            }
            return false;
          };

      };

    angular.module('fwk-security.user', [])
        .factory('userService', [function () {

            return function (data) {
                var userDTO = new UserDTOFactory(data);
                return userDTO;
              };

          }]);
