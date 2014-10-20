# Description des anomalies rencontrées régulièrement


## Plantage Tests Unitaires
Lors du Build ou de la création de la release, Karma lève l'exception suivante :

    PhantomJS 1.9.2 (Windows 7) ERROR 
        ReferenceError: Can't find variable: Module 

L'anomalie vient du fait que le fichier `angular-mocks.js` ne doit plus être présent dans l'arborescence `vendor-bower\angular-mocks`
