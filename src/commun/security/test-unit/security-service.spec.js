/**
 * Created by Guillemette on 13/05/2014.
 */
describe('Test authentService module', function () {

    var authentService, $httpBackend, userInfo;

    beforeEach(function () {
        angular.module('test', ['fwk-security.service']).value('FWK_CONSTANT',
            { profile: 'MOCK',
              oauth : {
                  accessToken : {
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
/**
    it('should send a http request to login the specified user', function() {
        $httpBackend.when('GET', 'src/commun/security/mock/user.json').respond(200, { user: userInfo });
        $httpBackend.expect('GET', 'src/commun/security/mock/user.json');
        authentService.resetCurrentUser();
        authentService.login('jdoe', 'password');
        $httpBackend.flush();
        expect(authentService.currentUser.getFullname()).toBe("John Doe");
    });
*/
 /**
    it('should logout user', function () {

        authentService.currentUser=userInfo;

        $httpBackend.when('GET', 'src/commun/security/mock/logout.json').respond(200, { user: userInfo });
        $httpBackend.expect('GET', '/login');
        service.login('email', 'password');
        $httpBackend.flush();

        //spyOn(authentService, "resetCurrentUser");
        authentService.logout();
        expect(authentService.currentUser===null).toBeTruthy();
        //expect(authentService.resetCurrentUser).toHaveBeenCalled();
        //expect(authentService.logout()).toContain("Vous avez été déconnecté de l\'application avec succés");
    });
 */
});