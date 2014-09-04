/**
 * Created by Guillemette on 12/05/2014.
 */
describe('Test UUID module', function () {

    var restFault, invalidCredentialFault, fieldValidationFault, accessDeniedFault, resourceStateChangedFault;


    beforeEach(function () {
        module('fwk-services.error');
    });

    beforeEach(inject(function($injector) {
        restFault = $injector.get('restFault');
        invalidCredentialFault = $injector.get('invalidCredentialFault');
        fieldValidationFault = $injector.get('fieldValidationFault') ;
        accessDeniedFault = $injector.get('accessDeniedFault') ;
        resourceStateChangedFault = $injector.get('resourceStateChangedFault') ;
    }));

    it('should exist restFault', function () {
        expect(restFault).toBeDefined();
    });

    it('should create an restFault', function () {
        var aRestFault = restFault("Problème lors de la connexion au serveur !", undefined);
        expect(aRestFault.name).toBe("RestFault");
        expect(aRestFault.message).toBe("Problème lors de la connexion au serveur !");
        expect(aRestFault.reasonOrigin).toBeUndefined();
        expect(aRestFault.toString()).toBe("RestFault / Problème lors de la connexion au serveur !");
    });

    it('should exist invalidCredentialFault', function () {
        expect(invalidCredentialFault).toBeDefined();
    });

    it('should create an invalidCredentialFault', function () {
        var anInvalidCredentialFault = invalidCredentialFault("Echec de l\'authentification.  Vérifiez votre login/mot de passe");
        expect(anInvalidCredentialFault.name).toBe("InvalidCredentialFault");
        expect(anInvalidCredentialFault.message).toBe("Echec de l\'authentification.  Vérifiez votre login/mot de passe");
        expect(anInvalidCredentialFault.toString()).toBe("InvalidCredentialFault / Echec de l\'authentification.  Vérifiez votre login/mot de passe");
    });

    it('should exist fieldValidationFault', function () {
        expect(fieldValidationFault).toBeDefined();
    });

    it('should create an fieldValidationFault', function () {
        var anInvalidCredentialFault = fieldValidationFault("Problème recontré lors de la validation du formulaire par le serveur !",
            {typeError:"FIELD_VALIDATION_ERROR",
             fieldErrors:[
                {fieldname:"nom",message:"La taille du champ nom doit &amp;ecirc&#x3b;tre comprise entre 3 et 30 caract&amp;egrave&#x3b;res",type:"Size"},
                {fieldname:"adresse",message:"La taille du champ adresse doit &amp;ecirc&#x3b;tre comprise entre 5 et 50 caract&amp;egrave&#x3b;res",type:"Size"}
             ]
            });
        expect(anInvalidCredentialFault.name).toBe("FIELD_VALIDATION_ERROR");
        expect(anInvalidCredentialFault.message).toBe("Problème recontré lors de la validation du formulaire par le serveur !");
        expect(anInvalidCredentialFault.fieldErrors).not.toBeNull;
        expect(anInvalidCredentialFault.fieldErrors.length).toBe(2);
        expect(anInvalidCredentialFault.fieldErrors[0].fieldname).toBe("nom");
        expect(anInvalidCredentialFault.toString()).toBe("FIELD_VALIDATION_ERROR / Problème recontré lors de la validation du formulaire par le serveur !");
    });

    it('should create an accessDeniedFault', function () {
        var anAaccessDeniedFault = accessDeniedFault(
            'Vous ne disposez pas des droits suffisants pour accéder à cette ressource !',
            {
                typeError:"UnauthorizedFault",
                message: "access denied"
            });
        expect(anAaccessDeniedFault.name).toBe("UnauthorizedFault");
        expect(anAaccessDeniedFault.message).toBe("Vous ne disposez pas des droits suffisants pour accéder à cette ressource !");
        expect(anAaccessDeniedFault.cause).toBe("access denied");
    });

    it('should create an resourceStateChangedFault', function () {
        var anResourceStateChangedFault = resourceStateChangedFault(
            'L\'état de la ressource a été modifié par un autre utilisateur !',
            {
                "typeError": "ResourceStateChangedFault",
                "message" : "Le librairie a été mis à jour par un autre utilisateur",
                "cause" : "Date Maj : 03/09/2014 à 18H25 par John Doe"
            });
        expect(anResourceStateChangedFault.name).toBe("ResourceStateChangedFault");
        expect(anResourceStateChangedFault.message).toBe("Le librairie a été mis à jour par un autre utilisateur");
        expect(anResourceStateChangedFault.cause).toBe("Date Maj : 03/09/2014 à 18H25 par John Doe");
    });

});