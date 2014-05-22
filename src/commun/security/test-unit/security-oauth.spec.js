/**
 * Created by Guillemette on 13/05/2014.
 */
/**
 * Created by Guillemette on 13/05/2014.
 */
describe('Test oauthService module', function () {

    var oauthService, tokenService;

    beforeEach(function () {
        angular.module('test', ['fwk-security.oauth']).value('FWK_CONSTANT',
            { profile: 'MOCK',
                idpBaseUrl: 'http://localhost:3001',
                mockPathBase: 'src/',
                oauth : {
                    queryStringParameters : {
                        response_type: 'token',
                        client_id : 'urn:cdc:retraite:esg:ihm:1.0',
                        redirect_uri : 'http://desote-web-springmvc-spi/oauth2Callback.html',
                        scope : 'urn:cdc:retraite:cli:rest:1.0, urn:cdc:retraite:set01:rest:1.0'
                    },
                    accessToken : {
                        prefix : 'APP_0.1',
                        keyname : 'ACCESS_TOKEN'
                    }
                }
             });
    });

    beforeEach(module('test'));

    beforeEach(inject(function($injector) {
        oauthService = $injector.get('oauthService');
        tokenService = $injector.get('tokenService');
    }));

    it('should retrieve token', function() {
        expect(oauthService).toBeDefined();
        expect(tokenService).toBeDefined();
        //en mode MOCK retrieveToken retourne un jeton sans accès  au service
        oauthService.retrieveToken().then(function(JWTtoken) {
            expect(JWTtoken).toBe("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJBUFBfVVNFUl9JRCI6IjM4OTRIIiwiQVBQX1VTRVJfUk9MRSI6WyJHRVNUSU9OTkFJUkUiXSwiQVBQX0NMSUVOVF9ST0xFIjpbIlJFQUQiLCJXUklURSJdLCJleHAiOjEzOTU4MTk3NTcsImF1ZCI6InVybjpjZGM6cmV0cmFpdGU6Y2xpOnJlc3Q6MS4wLCB1cm46Y2RjOnJldHJhaXRlOnNldDAxOnJlc3Q6MS4wIiwiaXNzIjoidXJuOmNkYzpjb25mbnVtOmlkcDphdXRoMiIsInN1YiI6InVybjpjZGM6cmV0cmFpdGU6ZXNnOmlobToxLjAiLCJpYXQiOjEzOTU4MTYxNTd9.1tnRB0ENn21zLvKdASQzSEzTfde0xCJYpuy0wZj7_RQ");
        });

        expect(tokenService.getLocalToken()).toBe("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJBUFBfVVNFUl9JRCI6IjM4OTRIIiwiQVBQX1VTRVJfUk9MRSI6WyJHRVNUSU9OTkFJUkUiXSwiQVBQX0NMSUVOVF9ST0xFIjpbIlJFQUQiLCJXUklURSJdLCJleHAiOjEzOTU4MTk3NTcsImF1ZCI6InVybjpjZGM6cmV0cmFpdGU6Y2xpOnJlc3Q6MS4wLCB1cm46Y2RjOnJldHJhaXRlOnNldDAxOnJlc3Q6MS4wIiwiaXNzIjoidXJuOmNkYzpjb25mbnVtOmlkcDphdXRoMiIsInN1YiI6InVybjpjZGM6cmV0cmFpdGU6ZXNnOmlobToxLjAiLCJpYXQiOjEzOTU4MTYxNTd9.1tnRB0ENn21zLvKdASQzSEzTfde0xCJYpuy0wZj7_RQ");

    });

});