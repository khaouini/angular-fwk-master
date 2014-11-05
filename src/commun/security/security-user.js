/**
 * Objet UserConnected public
 * Déclaré en global dans le fichier module.prefix
 * @constructor
 */
var UserConnected = function() {
};

UserConnected.prototype.isUserInRole =  function isUserInRole(role) {
    for (var i = 0; i < this.roles.length; i++) {
        if (this.roles[i].toString() === role) {
            return true;
        }
    }
    return false;
};

/**
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
*/
    angular.module('fwk-security.user', [])
        .factory('userService', [function () {

/**            UserConnected.prototype.getFullName = function getFullName() {
                return this.firstname + ' ' + this.lastname;
            };*/

/**            return function (data) {
                var userDTO = new UserDTOFactory(data);
                return userDTO;
              };*/

            /**
             * Modif MG 03/11/2014
             */
            return function(data) {
               var anUser = new UserConnected();
               angular.extend(anUser, data);
               return anUser;
            };

          }]);
