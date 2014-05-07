describe('Test base64 module', function () {

    var Base64,  $log;
    var auth, authBase64;

    beforeEach(function () {
        module('fwk-services.base64');
    });
    beforeEach(inject(function($injector) {
        Base64 = $injector.get('Base64');
        $log = $injector.get('$log');
    }));

    it('should return a base64 encoded String', function () {
        auth = 'matthieu:password';
        if (Base64 != null) { $log.info('OK');}
        $log.info('auth : ' + auth);
        authBase64 = Base64.encode(auth);
        expect(authBase64).toEqual('bWF0dGhpZXU6cGFzc3dvcmQ=');
    });

    it('should return a litteral String', function () {
        authBase64 = 'bWF0dGhpZXU6cGFzc3dvcmQ=';
        auth = Base64.decode(authBase64);
        expect(auth).toEqual('matthieu:password');
    });

});