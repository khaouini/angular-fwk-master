# Description des services proposés par le Socle DEI AngularJS


## Contexte d'emploi
Cette distribution apporte les services de base nécessaires :

- à la construction d'applications de type **SPI/SPA** (mashup client)
- s'appuyant sur le framework **AngularJS (v1.3.x)**
- déployée dans notre architecture interne **WOA (REST/SPS/OAUTH)**



## Apports

Sur la base du Framework MVC AngularJS, elle adresse un certain nombre de problèmatiques récurrentes, non outilées, parmis lesquelles :


- la gestion centralisée des codes erreur (`HTTP 500, 400, 401, ...`) en provenance des services REST
- la remontée des anomalies à la couche de présentation (client/browser) sous la forme d'exception
- la prise en charge de la cinématique "`OAUTH implicite flow`" avec l'IDP (avec ou sans pop-up)
- la prise en charge stockage et renouvellement jeton OAUTH en cas d'expériration (+ mise en attente des requetes)
- la prise en charge de la traçabilité des demandes et de leurs réponses (ajout identifiant unique, calcul temps passé, ...)


- la mécanique de traitement des anomalies de validation des formulaires par le controller REST 
- la fourniture de services de login, logout, construction objet User
- la fourniture de services de base : base64, uuid, logger, internationalisation des messages, ...etc


- la fourniture de principes d'intégration avec le librairie ui-router (gestion des habilitations, gestion des messages, ...)
- la fourniture d'une page d'erreur reprennant les éléments de corrélation et de traces nécessaires à l'exploitation
- ...etc



## Fiche d'identité

Nom : *angular-fwk-distrib*

Version courante : 0.0.13

Repository : [GitHub angular-fwk-distrib](https://github.com/mguillem37/angular-fwk-distrib.git)

Fichier Javascript : `angular-fwk-dei-0.0.13.min.js` (`angular-fwk-dei-0.0.13.js`)



## Dépendances

- [Framework AngularJS](https://angularjs.org/)
- [Angular UI Router](https://github.com/angular-ui/ui-router)
- [Angular local storage](http://gregpike.net/demos/angular-local-storage/demo.html)
- [Angular Translate - OPTIONAL](https://github.com/angular-translate/angular-translate)



## intégration dans les projets

###### Les étapes nécessaires à l'intégration et à la configuration du Socle DEI AngularJS sont abordées [ici](https://github.com/mguillem37/angular-fwk-distrib.git)



## Description des modules et des services



## Génération des librairies de la distribution

### montée de version
- modif package.json
- modif bower.json

### Lancement de la release

        grunt release
 

