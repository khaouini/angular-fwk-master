/**
 * Created by Guillemette on 13/05/2014.
 */
describe('Test httpLogger module', function () {

    var httpLogger;

    beforeEach(function () {
        angular.module('test', ['fwk-services.httpLogger']).value('FWK_CONSTANT',
            { trace : {
                MAX_HISTORY_SIZE: 3
            }});
    });

    beforeEach(module('test'));

    beforeEach(inject(function($injector) {
        httpLogger = $injector.get('httpLogger');
    }));

    it('should push logs', function () {
        httpLogger.pushLog("trace #1");
        expect(httpLogger.getLogs().length).toBe(1);
        httpLogger.pushLog("trace #2");
        httpLogger.pushLog("trace #3");
        expect(httpLogger.getLogs().length).toBe(3);
        httpLogger.pushLog("trace #4");
        expect(httpLogger.getLogs().length).toBe(3);
    });

    it('should clear logs', function () {
        httpLogger.pushLog("trace #1");
        httpLogger.pushLog("trace #2");
        httpLogger.pushLog("trace #3");
       expect(httpLogger.getLogs().length).toBe(3);
       httpLogger.clearLogs();
       expect(httpLogger.getLogs().length).toBe(0);
    });

});