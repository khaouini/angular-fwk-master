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

    var authentService, $httpBackend, userInfo, tokenService, $log;

    beforeEach(function () {
        angular.module('test', ['fwk-security.service']).value('FWK_CONSTANT',
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
        authentService = $injector.get('authentService');
        $httpBackend  = $injector.get('$httpBackend');
        $log = $injector.get('$log');
        tokenService =$injector.get('tokenService');

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

    it('should throw exception silentLogin without activeProfile parameter', function () {
        expect(authentService).toBeDefined();
        expect(function(){
            authentService.silentLogin("", "739d4686286163379af3854f37ed85", "b670b0bc-61e9-4430-9801-decc5310531c");
        }).toThrow();
    });

    it('should throw exception silentLogin without accessToken parameter', function () {
        expect(authentService).toBeDefined();
        expect(function(){
            authentService.silentLogin(userInfo, "", "b670b0bc-61e9-4430-9801-decc5310531c");
        }).toThrow();
    });

    it('should store activeProfil and accessToken', function () {
        expect(authentService).toBeDefined();
        expect(tokenService).toBeDefined();
        authentService.silentLogin(userInfo, "739d4686286163379af3854f37ed85", "b670b0bc-61e9-4430-9801-decc5310531c");
        expect(authentService.currentUser).toBeDefined();
        expect(authentService.currentUser.username).toBe('John');
        expect(tokenService.getLocalToken()).toBeDefined();
        expect(tokenService.getLocalToken()).toBe("739d4686286163379af3854f37ed85");
    });
});