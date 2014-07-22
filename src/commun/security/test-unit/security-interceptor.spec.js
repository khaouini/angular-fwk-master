/**
 * Created by Guillemette on 14/05/2014.
 */

describe('Tests requestSecurityInterceptor Module ', function() {
    var interceptor, promise, wrappedPromise, httpLogger, $http, oauthService,tokenService, config;

    beforeEach(function () {
        angular.module('test', ['fwk-security.interceptor', 'fwk-security.oauth']).value('FWK_CONSTANT',
            { profile: 'MOCK',
                oauth: {
                    queryStringParameters : {
                        response_type: 'token',
                        client_id : 'urn:cdc:retraite:esg:ihm:1.0',
                        redirect_uri : 'http://desote-web-springmvc-spi/oauth2Callback.html',
                        scope : 'urn:cdc:retraite:cli:rest:1.0, urn:cdc:retraite:set01:rest:1.0'
                    },
                    accessToken : {
                        prefix : 'APP_0.1',
                        keyname : 'ACCESS_TOKEN'
                    },
                    whitelist : {
                        // pas  d'ajout de jeton JWT pour ces urls
                        request : ['\\/idp\\/login','\\/idp\\/logout', '\\/oauth2\\/auth', '\\w+\\.tpl.html$', '\\w+\\.json$'],
                        // pas de traitement particulier (401) pour ces url
                        response: ['\\/idp/login']
                    }
                },
                trace : {
                    MAX_HISTORY_SIZE: 3
                }
            });
    });

    beforeEach(module('test'));

    beforeEach(inject(function($injector) {
        oauthService = $injector.get('oauthService');
        tokenService = $injector.get('tokenService');
        interceptor = $injector.get('requestSecurityInterceptor');
        httpLogger = $injector.get('httpLogger');
        $http = $injector.get('$http');
//        wrappedPromise = {};
//        promise = {
//            then: jasmine.createSpy('then').andReturn(wrappedPromise)
//        };
        config = {
            url: "/idp/login",
            cache: {},
            headers: {
                Accept: "application/json"
            }
        };
        spyOn(tokenService, "getLocalToken").andReturn("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJBUFBfVVNFUl9JRCI6IjM4OTRIIiwiQVBQX1VTRVJfUk9MRSI6WyJHRVNUSU9OTkFJUkUiXSwiQVBQX0NMSUVOVF9ST0xFIjpbIlJFQUQiLCJXUklURSJdLCJleHAiOjEzOTU4MTk3NTcsImF1ZCI6InVybjpjZGM6cmV0cmFpdGU6Y2xpOnJlc3Q6MS4wLCB1cm46Y2RjOnJldHJhaXRlOnNldDAxOnJlc3Q6MS4wIiwiaXNzIjoidXJuOmNkYzpjb25mbnVtOmlkcDphdXRoMiIsInN1YiI6InVybjpjZGM6cmV0cmFpdGU6ZXNnOmlobToxLjAiLCJpYXQiOjEzOTU4MTYxNTd9.1tnRB0ENn21zLvKdASQzSEzTfde0xCJYpuy0wZj7_RQ");
        spyOn(tokenService, "getUUID").andReturn("ca38320b-841d-4659-81eb-9ffcda0f512b");
        expect(interceptor).toBeDefined();
    }));

    it('should request idp/login OK', function() {
        var newPromise = interceptor.request(config);
        expect(config.headers['X-RequestID']).toMatch("[0123456789abcdef]{8}-[0123456789abcdef]{4}-[0123456789abcdef]{4}-[0123456789abcdef]{4}-[0123456789abcdef]{12}");
        expect(httpLogger.getLogs().length).toBe(1);
    });

    it('should request rest/domaines OK', function() {
        config.url="/rest/domaines";
        var newPromise = interceptor.request(config);
        expect(config.headers['X-RequestID']).toMatch("[0123456789abcdef]{8}-[0123456789abcdef]{4}-[0123456789abcdef]{4}-[0123456789abcdef]{4}-[0123456789abcdef]{12}");
        expect(config.headers['Authorization']).toBe("Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJBUFBfVVNFUl9JRCI6IjM4OTRIIiwiQVBQX1VTRVJfUk9MRSI6WyJHRVNUSU9OTkFJUkUiXSwiQVBQX0NMSUVOVF9ST0xFIjpbIlJFQUQiLCJXUklURSJdLCJleHAiOjEzOTU4MTk3NTcsImF1ZCI6InVybjpjZGM6cmV0cmFpdGU6Y2xpOnJlc3Q6MS4wLCB1cm46Y2RjOnJldHJhaXRlOnNldDAxOnJlc3Q6MS4wIiwiaXNzIjoidXJuOmNkYzpjb25mbnVtOmlkcDphdXRoMiIsInN1YiI6InVybjpjZGM6cmV0cmFpdGU6ZXNnOmlobToxLjAiLCJpYXQiOjEzOTU4MTYxNTd9.1tnRB0ENn21zLvKdASQzSEzTfde0xCJYpuy0wZj7_RQ");
        expect(httpLogger.getLogs().length).toBe(1);
    });

});

describe('Tests responseSecurityInterceptor Module ', function() {
    var interceptor, promise, wrappedPromise, httpLogger, $http, oauthService, tokenService, aResponse, koResponse, restFault;

    beforeEach(function () {
        angular.module('test', ['fwk-security.interceptor', 'fwk-security.oauth', 'fwk-services.error']).value('FWK_CONSTANT',
            { profile: 'MOCK',
                oauth: {
                    queryStringParameters: {
                        response_type: 'token',
                        client_id: 'urn:cdc:retraite:esg:ihm:1.0',
                        redirect_uri: 'http://desote-web-springmvc-spi/oauth2Callback.html',
                        scope: 'urn:cdc:retraite:cli:rest:1.0, urn:cdc:retraite:set01:rest:1.0'
                    },
                    accessToken: {
                        prefix: 'APP_0.1',
                        keyname: 'ACCESS_TOKEN'
                    },
                    whitelist: {
                        // pas  d'ajout de jeton JWT pour ces urls
                        request: ['\\/idp\\/login', '\\/idp\\/logout', '\\/oauth2\\/auth', '\\w+\\.tpl.html$', '\\w+\\.json$'],
                        // pas de traitement particulier (401) pour ces url
                        response: ['\\/idp/login']
                    }
                },
                trace: {
                    MAX_HISTORY_SIZE: 3
                }
            });
    });

    beforeEach(module('test'));

    beforeEach(inject(function ($injector) {
        oauthService = $injector.get('oauthService');
        tokenService = $injector.get('tokenService');
        interceptor = $injector.get('responseSecurityInterceptor');
        httpLogger = $injector.get('httpLogger');
        $http = $injector.get('$http');
        restFault = $injector.get('restFault');
        $rootScope = $injector.get('$rootScope');

//        wrappedPromise = {};
//        promise = {
//            then: jasmine.createSpy('then').andReturn(wrappedPromise)
        //       };
        aResponse = {
            config: {
                requestTimestamp: 1400076677946,
                url: "/rest/domaines",
                cache: {},
                headers: {
                    Accept: "application/json",
                    "X-RequestID": "ca38320b-841d-4659-81eb-9ffcda0f512b"
                },
                status: 200,
                data: "données..."
            }
        };
        koResponse = {
            config: {
                requestTimestamp: 1400076677946,
                url: "/rest/domaines",
                mockPathBase: 'src/',
                cache: {},
                headers: {
                    Accept: "application/json",
                    "X-RequestID": "ca38320b-841d-4659-81eb-9ffcda0f512b"
                }
            },
            status: 400, //Bad Request
            data: {
                "typeError": "FieldValidationFault",
                "fieldErrors": [
                    {"fieldname": "nom", "message": "La taille du champ nom doit &amp;ecirc&#x3b;tre comprise entre 3 et 30 caract&amp;egrave&#x3b;res", "type": "Size"},
                    {"fieldname": "adresse", "message": "La taille du champ adresse doit &amp;ecirc&#x3b;tre comprise entre 5 et 50 caract&amp;egrave&#x3b;res", "type": "Size"}
                ]
            }

        };
        spyOn(tokenService, "getLocalToken").andReturn("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJBUFBfVVNFUl9JRCI6IjM4OTRIIiwiQVBQX1VTRVJfUk9MRSI6WyJHRVNUSU9OTkFJUkUiXSwiQVBQX0NMSUVOVF9ST0xFIjpbIlJFQUQiLCJXUklURSJdLCJleHAiOjEzOTU4MTk3NTcsImF1ZCI6InVybjpjZGM6cmV0cmFpdGU6Y2xpOnJlc3Q6MS4wLCB1cm46Y2RjOnJldHJhaXRlOnNldDAxOnJlc3Q6MS4wIiwiaXNzIjoidXJuOmNkYzpjb25mbnVtOmlkcDphdXRoMiIsInN1YiI6InVybjpjZGM6cmV0cmFpdGU6ZXNnOmlobToxLjAiLCJpYXQiOjEzOTU4MTYxNTd9.1tnRB0ENn21zLvKdASQzSEzTfde0xCJYpuy0wZj7_RQ");
        spyOn(tokenService, "getUUID").andReturn("ca38320b-841d-4659-81eb-9ffcda0f512b");
        expect(interceptor).toBeDefined();
    }));

    it('should response OK', function () {
        var newResponse = interceptor.response(aResponse);
        expect(newResponse).toBe(aResponse);
        expect(httpLogger.getLogs().length).toBe(1);
    });


    // HTTP 400 TESTS
    it('should response HTTP 400', function () {

        var resultFault = null;

        interceptor.responseError(koResponse).then(null, function (fault) {
            resultFault=fault;
        });

        // promises are resolved/dispatched only on next $digest cycle
        $rootScope.$apply();

        expect(resultFault).toBeDefined();
        expect(resultFault.name).toBe("FieldValidationFault");
        expect(resultFault.message).toBe("Problème recontré lors de la validation du formulaire par le serveur !");
        expect(resultFault.fieldErrors).not.toBeNull;
        expect(resultFault.fieldErrors.length).toBe(2);
        expect(resultFault.fieldErrors[0].fieldname).toBe("nom");

        expect(httpLogger.getLogs().length).toBe(1);
    });

    it('should response HTTP 400 with expcetion', function () {
        koResponse.data = 'Unauthorized';
        expect( function() {
            interceptor.responseError(koResponse);
        }).toThrow();
        expect(httpLogger.getLogs().length).toBe(1);
    });


    // HTTP 500 TESTS
    it('should response HTTP 500', function () {
        koResponse.status = 500;
        expect(function () {
            interceptor.responseError(koResponse);
        }).toThrow();
    });


    // HTTP 401 TESTS
    it('should response HTTP 401 Invalid login password', function () {
        koResponse.status = 401;
        koResponse.config.url = "/idp/login";
        koResponse.data = 'Unauthorized';

        var resultFault = null;

        interceptor.responseError(koResponse).then(null, function (fault) {
            resultFault=fault;
        });

        // promises are resolved/dispatched only on next $digest cycle
        $rootScope.$apply();

        expect(resultFault).toBeDefined();
        expect(resultFault.name).toBe("InvalidCredentialFault");
        expect(httpLogger.getLogs().length).toBe(1);
    });

    it('should response HTTP 401 page white list', function () {
        koResponse.status = 401;
        koResponse.config.url = "/idp/login";
        koResponse.data = 'autre erreur non gérée...';

        var resultFault = null;

        interceptor.responseError(koResponse).then(null, function (fault) {
            resultFault=fault;
        });

        // promises are resolved/dispatched only on next $digest cycle
        $rootScope.$apply();

        expect(resultFault).toBeDefined();
        expect(resultFault.name).toBe("RestFault");

        expect(httpLogger.getLogs().length).toBe(1);
    });

    it('should response HTTP 401 absence de jeton JWT', function () {
        koResponse.status = 401;
        koResponse.data = {
            error: {
                code: 'credentials_required'
            }
        };
        //en mode MOCK retrieveToken retourne un jeton sans accès  au service
        expect(interceptor.responseError(koResponse)).toBeDefined();

    });

    it('should response with error', function () {
        var anError = new Error();
        expect(function(){
            interceptor.responseError(anError);
        }).toThrow();
    });


    // HTTP 404 TESTS
    it('should response HTTP 404 with reject promise', function () {

        koResponse.status = 404;
        koResponse.data = {
            "message":"Le libraire est inconnu",
            "cause": null,
            "typeError":"ResourceNotFoundFault"
        };

        var resultFault = null;

        interceptor.responseError(koResponse).then(null, function (fault) {
            resultFault=fault;
        });

        // promises are resolved/dispatched only on next $digest cycle
        $rootScope.$apply();

        expect(resultFault).toBeDefined();
        expect(resultFault.name).toBe("ResourceNotFoundFault");
        expect(resultFault.message).toBe("Le libraire est inconnu");
        expect(resultFault.cause).toBeNull();

        expect(httpLogger.getLogs().length).toBe(1);
    });

    it('should response HTTP 404 with exception', function () {
        koResponse.status = 404;
        koResponse.data = 'Unauthorized';

        expect( function() {
            interceptor.responseError(koResponse);
        }).toThrow();

        expect(httpLogger.getLogs().length).toBe(1);
    });

    // HTTP 403 TESTS
    it('should response HTTP 403 with reject promise', function () {

        koResponse.status = 403;
        koResponse.data = {
            typeError:"AccessDeniedFault",
            message: "access denied"
        };

        var resultFault = null;

        interceptor.responseError(koResponse).then(null, function (fault) {
            resultFault=fault;
        });

        // promises are resolved/dispatched only on next $digest cycle
        $rootScope.$apply();

        expect(resultFault).toBeDefined();
        expect(resultFault.name).toBe("AccessDeniedFault");
        expect(resultFault.cause).toBe("access denied");

        expect(httpLogger.getLogs().length).toBe(1);
    });

    it('should response HTTP 403 with exception', function () {
        koResponse.status = 403;
        koResponse.data = 'Unauthorized';

        expect( function() {
            interceptor.responseError(koResponse);
        }).toThrow();

        expect(httpLogger.getLogs().length).toBe(1);
    });
});