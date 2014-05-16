
    angular.module( 'fwk-common-state-uc',
    	['ui.router',
         'fwk-common-uc'
    ])

    .config(function config( $stateProvider ) {

      $stateProvider

        ////////////
        // Error //
        ////////////

        .state('error', {
          url: '/error',
          templateUrl: 'commun/fwk-error.tpl.html',
          controller: 'fwkErrorCtrl',
          data:{ pageTitle: 'Erreur' }
        })

        //////////////////
        // Unauthorized //
        //////////////////

        .state('unauthorized', {
            // Use a url of "/" to set a states as the "index".
            url: '/unauthorized',
            template: '<p class="lead">Vous n\'êtes pas habilité à accéder à cette ressources !</p>' +
                '<p>Cliquez <a href="#/start">ici</a> pour vous ré-authentifier ou utiliser le bouton <i class="glyphicon glyphicon-arrow-left"></i> <i>Back</i> du navigateur pour revenir à la page précédente</p>',
            data:{ pageTitle: 'Non Habilité ! ' }
        });

    });