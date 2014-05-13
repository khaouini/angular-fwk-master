/**
 * Created by Guillemette on 13/05/2014.
 */
describe('Tests notifications Module', function () {

    var notifications;

    beforeEach(module('fwk-services.notifications'));

    beforeEach(inject(function($injector) {
        notifications = $injector.get('notifications');
    }));

    it('should allow to add, get and remove notifications', function () {

        var not1 = notifications.pushSticky({msg:'notifcation #1'});
        var not2 = notifications.pushForCurrentRoute({msg:'notification #2'});

        expect(notifications.getCurrent().length).toBe(2);

        notifications.remove(not2);

        expect(notifications.getCurrent().length).toEqual(1);
        expect(notifications.getCurrent()[0]).toBe(not1);

        notifications.removeAll();
        expect(notifications.getCurrent().length).toEqual(0);
    });

    it('should reject notifications that are not objects', function () {
        expect(function(){
            notifications.pushSticky("une chaine de caractère");
        }).toThrow(new Error("Only object can be added to the notification service"));
    });

    it('should allow to add for next route', function () {
        notifications.removeAll();
        var not3 = notifications.pushForNextRoute({msg:'notifcation #3'});
        expect(notifications.getCurrent().length).toEqual(0);

        notifications.onStateChangeSuccess();
        expect(notifications.getCurrent().length).toEqual(1);
    });

});