/**
 * Created by Guillemette on 13/05/2014.
 */
describe('Test localized messages Module', function () {

    var localizedMessages;

    beforeEach(function () {
        angular.module('test', ['fwk-services.localizedMessages']);
        module('test');
    });

    beforeEach(inject(function (_localizedMessages_) {
        localizedMessages = _localizedMessages_;
    }));

    it('should return a localized message if defined', function () {
        expect(localizedMessages.get('logout.success.msg')).toEqual('Vous avez été déconnecté de l\'application avec succés !');
    });

    it('should return a message key surrounded by a question mark for non-existing messages', function () {
        expect(localizedMessages.get('non.existing')).toEqual('?non.existing?');
    });

    it('should interpolate parameters', function () {
        expect(localizedMessages.get('resource.error.server', {resourcename:'User'})).toEqual('Problème d\'accès à la resource User');
    });

    it('should not break for missing params', function () {
        expect(localizedMessages.get('resource.error.server')).toEqual('Problème d\'accès à la resource ');
        expect(localizedMessages.get('resource.error.server', {other:'User'})).toEqual('Problème d\'accès à la resource ');
    });
});