/**
 * Created by Guillemette on 03/03/14.
 */



    var RestFault = function (msgFault, reasonFault) {

        //appel du constructeur de la super classe Error
        //Error.call(this, msgFault);

        this.name = 'RestFault';
        this.message = msgFault || 'Problème d\'accès au service REST';
        this.reasonOrigin = reasonFault || undefined;
        this.cause = '';
        this.toString = function() {
            return this.name + ' / ' + this.message;
        };

    };

    var InvalidCredentialFault = function(msgFault) {
        this.name = 'InvalidCredentialFault';
        this.message = msgFault || 'Problème lors de l\'authentifrication';
        this.cause = '';
        this.toString = function () {
            return this.name + ' / ' + this.message;
        };
    };

    var FieldValidationFault = function(msgFault, fieldErrorException) {
        this.name = fieldErrorException.typeError;
        this.message =  msgFault || 'Problème recontré lors de la validation des champs par le serveur';
        this.fieldErrors = fieldErrorException.fieldErrors;
        this.cause = '';
        this.toString = function () {
            return this.name + ' / ' + this.message;
        };
    };

    var ResourceNotFoundFault = function(msgFault, resourceNotFoundException) {
        this.name = resourceNotFoundException.typeError;
        this.message =  msgFault;
        this.cause = resourceNotFoundException.cause || '';
        this.toString = function () {
            return this.name + ' / ' + this.message + ' / ' + this.cause;
        };
    };

    var AccessDeniedFault = function(msgFault, accessDeniedException) {
        this.name = accessDeniedException.typeError;
        this.message =  msgFault;
        this.cause = accessDeniedException.message || '';
        this.toString = function () {
            return this.name + ' / ' + this.message;
        };
    };

    var ResourceStateChangedFault = function(msgFault, resourceStateChangedException) {
        this.name = resourceStateChangedException.typeError;
        this.message =  resourceStateChangedException.message;
        this.cause = resourceStateChangedException.cause || '';
        this.toString = function () {
            return this.name + ' / ' + this.message;
        };
    };

    angular.module('fwk-services.error', [])

        .factory('restFault',function () {

            return function(msgFault, reasonFault) {
                RestFault.prototype = new Error();
                RestFault.prototype.constructor = RestFault;
                return new RestFault(msgFault, reasonFault);
            };
        })

        .factory('invalidCredentialFault',function () {

            return function(msgFault) {
                InvalidCredentialFault.prototype = new Error();
                InvalidCredentialFault.prototype.constructor = InvalidCredentialFault;
                return new InvalidCredentialFault(msgFault);
            };
        })

        .factory('fieldValidationFault',function () {

            return function(msgFault, fieldErrorException) {
            	FieldValidationFault.prototype = new Error();
            	FieldValidationFault.prototype.constructor = FieldValidationFault;
                return new FieldValidationFault(msgFault, fieldErrorException);
            };
        })

        .factory('resourceNotFoundFault',function () {

            return function(msgFault, resourceNotFoundException) {
                ResourceNotFoundFault.prototype = new Error();
                ResourceNotFoundFault.prototype.constructor = ResourceNotFoundFault;
                return new ResourceNotFoundFault(msgFault, resourceNotFoundException);
            };
        })

        .factory('accessDeniedFault',function () {

            return function(msgFault, accessDeniedException) {
                AccessDeniedFault.prototype = new Error();
                AccessDeniedFault.prototype.constructor = AccessDeniedFault;
                return new AccessDeniedFault(msgFault, accessDeniedException);
            };
        })

        .factory('resourceStateChangedFault',function () {

            return function(msgFault, resourceStateChangedException) {
                ResourceStateChangedFault.prototype = new Error();
                ResourceStateChangedFault.prototype.constructor = ResourceStateChangedFault;
                return new ResourceStateChangedFault(msgFault, resourceStateChangedException);
            };
        })

        .factory('stackFault', function () {

            var error;

            var ErrorProcessorFactory =  function () {

                this.setError = function(errorFault) {
                    error=errorFault;
                };

                this.getError = function() {
                    return error;
                };

            };

            return new ErrorProcessorFactory ();

        });