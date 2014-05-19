/**
 * Created by Guillemette on 12/05/2014.
 */
describe('Test UUID module', function () {

    var restFault, invalidCredentialFault, fieldValidationFault;


    beforeEach(function () {
        module('fwk-services.error');
    });

    beforeEach(inject(function($injector) {
        restFault = $injector.get('restFault');
        invalidCredentialFault = $injector.get('invalidCredentialFault');
        fieldValidationFault = $injector.get('fieldValidationFault') ;
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

});