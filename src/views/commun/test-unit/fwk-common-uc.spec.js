describe('Test fwkErrorCtrl module', function () {

    var $scope, stackFault, i18nNotifications, authentService, httpLogger, user, browserInfo;

    beforeEach(function () {
        angular.module('test', ['fwk-common-uc']).value('FWK_CONSTANT',
            { profile: 'MOCK',
                oauth : {
                    accessToken : {
                        prefix : 'APP_0.1',
                        keyname : 'ACCESS_TOKEN'
                    }
                }});

    });

    beforeEach(module('test'));

    beforeEach(inject(function ($rootScope) {
        $scope = $rootScope.$new();
    }));

    beforeEach(inject(function($injector) {
        stackFault = $injector.get('stackFault');
        i18nNotifications = $injector.get('i18nNotifications');
        authentService = $injector.get('authentService') ;
        httpLogger = $injector.get('httpLogger');
        browserInfo = $injector.get('browserInfo');


        user = {
            "id": 123456,
            "username": "John",
            "roles": ["ADMIN"],
            "firstname": "John",
            "lastname": "Doe",
            "email": "john.doe@unknow.com"
        };
    }));

    it('should remove an existing team member', inject(function ($controller) {

        spyOn(authentService, "currentUser").andReturn(user);
        spyOn(httpLogger, "getLogs").andReturn([{msg: 'log #1'}, {msg: 'log #2'}]);
        spyOn(stackFault, "getError").andReturn(
            {name: 'Test error',
             msg: 'Message erreur',
             reasonOrigin : {
                 config: {
                     requestTimestamp: 1400076677946,
                     url: "/rest/domaines",
                     cache: {},
                     headers: {
                         Accept: "application/json",
                         "X-RequestID": "ca38320b-841d-4659-81eb-9ffcda0f512b"
                     }
                 }
             }
            });

        $controller('fwkErrorCtrl', {
            '$scope': $scope,
            'stackFault': stackFault,
            'i18nNotifications' : i18nNotifications,
            'authentService' : authentService,
            'httpLogger' : httpLogger,
            'browserInfo' : browserInfo
        });

        expect($scope.currentUser).toBeDefined();
        expect($scope.calls.length).toBe(2);
        expect($scope.error.name).toBe("Test error");
        expect($scope.headers.length).toBe(2);
        expect($scope.browserLocalInfo).toBeDefined();

    }));

});