/**
 * Created by Guillemette on 12/05/2014.
 */
describe('Test UUID module', function () {

    var UUID,  $log;


    beforeEach(function () {
        module('fwk-services.uuid');
    });
    beforeEach(inject(function($injector) {
        UUID = $injector.get('UUID');
        $log = $injector.get('$log');
    }));

    it('should return an radom UUID', function () {
        expect(UUID).toBeDefined();
        expect(UUID.randomUUID()!=null).toBeTruthy();
    });

    it('should match regex', function() {
        //ca38320b-841d-4659-81eb-9ffcda0f512b
        expect(UUID.randomUUID()).toMatch("[0123456789abcdef]{8}-[0123456789abcdef]{4}-[0123456789abcdef]{4}-[0123456789abcdef]{4}-[0123456789abcdef]{12}");
    });

});