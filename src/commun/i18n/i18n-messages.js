
    angular.module('fwk-i18n.messages', [])

	.constant('I18N.MESSAGES', {
	    'crud.save.error.librairie': 'Les données du libraire ({{ nomLibraire}}) n\'ont pu être sauvegardées en base !',
	    'crud.save.success.librairie': 'Le libraire "{{nomLibraire}}" a été sauvegardé avec succés !',
        'errors.route.unAuthorized': 'Vous n\'êtes pas habilité à accéder à cette page (droits insuffisants ou non authentifié).',
	    'login.error.invalidCredentials': 'Echec de l\'authentification.  Vérifiez votre login/mot de passe.',
	    'login.success.msg': 'BRAVO ! Vous vous êtes authentifié avec succés !',
	    'logout.success.msg': 'Vous avez été déconnecté de l\'application avec succés (à {{ dateTime }})!',
	    'logout.error.msg' : 'Un problème est survenu lors de la déconnexion de l\'utilisateur !',
	    'error.fatal': 'Une erreur grave est survenue ! {{error}}',
	    'resource.error.server': 'Problème d\'accès à la resource {{resourcename}}',
	    'resource.validation.error.server' : 'Problème recontré lors de la validation du formulaire par le serveur !',
	    'token.error.server': 'Problème lors de la connexion au serveur de jeton',
	    'trace.request.msg': '{{dateTime}} - REQUEST TO {{url}} - X-REQUEST-ID : {{uuid}}',
	    'trace.response.msg': '{{dateTime}} - RESPONSE [{{type}} / {{status}}] FROM {{url}} - X-REQUEST-ID : {{uuid}} - DUREE : {{delay}} secondes'
	});
