module.exports = function (config) {

    config.set({

        basePath: '../../../',

        /**
         * This is the list of file patterns to load into the browser during testing.
         * A noter : angular-mocks is used for Jasmine and Karma testing. It publishes global methods module() and inject() to be used in your Jasmine spec tests.
         */
        files: [
            <% scripts.forEach( function ( file ) { %>'<%= file %>',
                <% }); %>
            'build/js/angular-fwk-dei-0.0.1-SNAPSHOT.js', //TODO
            'build/tests/unit/**/*.spec.js'
        ],

        /**
         * You should not however include the files that aren't directly related to your program, e.g. libraries, mocks, neither tests.
         * Pas le fichier minifier sinon 100% de couverture !
         */
        preprocessors : {
            'build/js/angular-fwk-dei-0.0.1-SNAPSHOT.js': ['coverage']
        },

        reporters: ['progress', 'coverage'],

        //TODO à paramétrer !
        coverageReporter : {
            type : 'html',
            dir : 'reports/coverage/',
            file: 'index.html'
        },

        exclude: [],

        frameworks: [ 'jasmine' ],
        plugins: [ 'karma-jasmine', 'karma-phantomjs-launcher', 'karma-coverage' ],

        singleRun: true,
        port: 9018,
        runnerPort: 9100,
        urlRoot: '/',
        autoWatch: false,
        browsers: ['PhantomJS'],
        colors: true,
        logLevel: config.LOG_INFO
    });

};