/**
 * Created by Guillemette on 13/05/2014.
 */
describe('Test securityUtils module', function () {
    var securityUtils;

    beforeEach(module('fwk-security.service'));

    beforeEach(inject(function($injector) {
        securityUtils = $injector.get('securityUtils');
    }));

    it('should find a role', function() {
        var roles = ['ADMIN','GEST','UTIL'];
        expect(securityUtils.findByRole(roles, 'GEST')).toBeTruthy();
        expect(securityUtils.findByRole(roles, 'CCMT')).toBeFalsy();
    });
});

describe('Test authentService module', function () {

    var authentService, $httpBackend, userInfo;

    beforeEach(function () {
        angular.module('test', ['fwk-security.service']).value('FWK_CONSTANT',
            { profile: 'MOCK',
              oauth : {
                  accessToken : {
                      prefix : 'APP_0.1',
                      keyname : 'ACCESS_TOKEN'
                  }
              }});
    });

    beforeEach(module('test'));

    beforeEach(inject(function($injector) {
        authentService = $injector.get('authentService');
        $httpBackend  = $injector.get('$httpBackend');
        $log = $injector.get('$log');

        userInfo ={
            "id": 123456,
            "username": "John",
            "roles": ["ADMIN"],
            "firstname": "John",
            "lastname": "Doe",
            "email": "john.doe@unknow.com"
        };
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


    it('should reset current user', function () {
        expect(authentService).toBeDefined();
        authentService.currentUser=userInfo;
        authentService.resetCurrentUser();
        expect(authentService.currentUser).toBeNull();
    });

    it('should test is authenticated ?', function () {
        authentService.currentUser=userInfo;
        expect(authentService.isAuthenticated()).toBeTruthy();
        authentService.resetCurrentUser();
        expect(authentService.isAuthenticated()).toBeFalsy();
    });

    it('should login for valid login/password', function() {
        $httpBackend.when('GET', 'src/commun/security/mock/user.json').respond(200, { user: userInfo });
        $httpBackend.expect('GET', 'src/commun/security/mock/user.json');
        authentService.resetCurrentUser();
        authentService.login('jdoe', 'password');
        $httpBackend.flush();
        expect(authentService.currentUser).not.toBeNull();
    });

    it('should throw exception for invalid login/password', function() {
        authentService.resetCurrentUser();
        authentService.login('matthieu', 'password')
            .then(
                //Success...récupération du boolean remonté par la méthode d'authent
                function (isAuthenticated) {
                    expect(isAuthenticated).toBeTruthy();
                }
            )
            // catch : shorthand for promise.then(null, errorCallback)
            .catch(
                function (error) {
                    expect(error.name).toBe('InvalidCredentialFault');
                }
            );
    });

    it('should logout user', function() {
        authentService.currentUser=userInfo;
        $httpBackend.when('GET', 'src/commun/security/mock/logout.json').respond(200, {"timestamp": 1395831316776});
        $httpBackend.expect('GET', 'src/commun/security/mock/logout.json');
        authentService.logout();
        $httpBackend.flush();
        expect(authentService.currentUser).toBeNull();
    });
});