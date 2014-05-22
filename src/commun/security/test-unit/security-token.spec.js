/**
 * Created by Guillemette on 13/05/2014.
 */
/**
 * Created by Guillemette on 13/05/2014.
 */
describe('Test tokenService module', function () {

    var tokenService;

    beforeEach(function () {
        angular.module('test', ['fwk-security.oauth']).value('FWK_CONSTANT',
            { profile: 'MOCK',
                mockPathBase: 'src/',
                oauth : {
                    accessToken : {
                        prefix : 'APP_0.1',
                        keyname : 'ACCESS_TOKEN'
                    }
                }});
    });

    beforeEach(module('test'));

    beforeEach(inject(function($injector) {
        tokenService = $injector.get('tokenService');
    }));

    it('should store an get local token', function () {

        expect(tokenService).toBeDefined();

        var tokenJWT = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJBUFBfVVNFUl9JRCI6IjM4OTRIIiwiQVBQX1VTRVJfUk9MRSI6WyJHRVNUSU9OTkFJUkUiXSwiQVBQX0NMSUVOVF9ST0xFIjpbIlJFQUQiLCJXUklURSJdLCJleHAiOjEzOTU4MTk3NTcsImF1ZCI6InVybjpjZGM6cmV0cmFpdGU6Y2xpOnJlc3Q6MS4wLCB1cm46Y2RjOnJldHJhaXRlOnNldDAxOnJlc3Q6MS4wIiwiaXNzIjoidXJuOmNkYzpjb25mbnVtOmlkcDphdXRoMiIsInN1YiI6InVybjpjZGM6cmV0cmFpdGU6ZXNnOmlobToxLjAiLCJpYXQiOjEzOTU4MTYxNTd9.1tnRB0ENn21zLvKdASQzSEzTfde0xCJYpuy0wZj7_RQ";
        tokenService.storeLocalToken(tokenJWT);

        expect(tokenService.getLocalToken()).toBe(tokenJWT);
    });

    it('should delete local token', function () {

        var tokenJWT = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJBUFBfVVNFUl9JRCI6IjM4OTRIIiwiQVBQX1VTRVJfUk9MRSI6WyJHRVNUSU9OTkFJUkUiXSwiQVBQX0NMSUVOVF9ST0xFIjpbIlJFQUQiLCJXUklURSJdLCJleHAiOjEzOTU4MTk3NTcsImF1ZCI6InVybjpjZGM6cmV0cmFpdGU6Y2xpOnJlc3Q6MS4wLCB1cm46Y2RjOnJldHJhaXRlOnNldDAxOnJlc3Q6MS4wIiwiaXNzIjoidXJuOmNkYzpjb25mbnVtOmlkcDphdXRoMiIsInN1YiI6InVybjpjZGM6cmV0cmFpdGU6ZXNnOmlobToxLjAiLCJpYXQiOjEzOTU4MTYxNTd9.1tnRB0ENn21zLvKdASQzSEzTfde0xCJYpuy0wZj7_RQ";
        tokenService.storeLocalToken(tokenJWT);
        tokenService.clearLocalToken()

        expect(tokenService.getLocalToken()).toBe("");
    });

    it('should get UUID', function () {
        expect(tokenService.getUUID()).toBeDefined();
    });
});