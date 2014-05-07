/**
 * Created by Guillemette on 03/03/14.
 */


    angular.module('fwk-directives', [])

    //  <fwk-form-server-error form="newLibForm"></fwk-form-server-error>
    // Géré sous la forme d'un tag html dédié plutot qu'au niveau du formualire afin de gérer plus facilememnt l'affichage des erreurs
    .directive('fwkFormServerError', function() {

        return {

            restrict: 'E',
            replace: true,
            scope: {
                form : '='
            },

            templateUrl: 'commun/fwk-server-error.tpl.html',

            controller: function($scope) {

                $scope.exceptionFromServer=undefined;

                //ATTENTION : Broadcast fonctionne car présent dans un controler !
                //si des erreurs de validation sont remontées par le serveur
                $scope.$on('$fieldErrorValidationException', function(event, exception){
                    //l'exception est du type FieldValidationFault remontée par l'interceptor
                    $scope.exceptionFromServer = exception;

                    // $scope.form donne accès au formulaire
                    // La valorisation de l'error 'server' bloque la soumission du formulaire

                    angular.forEach($scope.exceptionFromServer.fieldErrors, function (fieldError) {
                        $scope.form[fieldError.fieldname].$setValidity('server', false);

                        // ...à la procchaine saisie le champs est repositionné sans erreur 'server'
                        $scope.form[fieldError.fieldname].$parsers.push(function(viewValue) {
                            if ($scope.form[fieldError.fieldname].$error.server) {
                                $scope.form[fieldError.fieldname].$setValidity('server', true);
                            }
                            return viewValue;
                        });

                        // ...si la modif vient du model, le champs est repositionné sans erreur 'server'
                        $scope.form[fieldError.fieldname].$formatters.unshift(function(modelValue) {
                            if ($scope.form[fieldError.fieldname].$error.server) {
                                $scope.form[fieldError.fieldname].$setValidity('server', true);
                            }
                            return modelValue;
                        });

                    });

                    //donne le focus au premier champ en erreur
                    // le code ci-aprésne marche pas : pas de fonction focus() sur login $scope.exceptionFromServer.fieldErrors[0].fieldname.focus();
                    angular.element("input[name=" + $scope.exceptionFromServer.fieldErrors[0].fieldname + "]").focus();
                });

            }
        };
    });