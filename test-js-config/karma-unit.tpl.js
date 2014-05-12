module.exports = function ( config ) {

    config.set({

        basePath: '../../../',

        /**
         * This is the list of file patterns to load into the browser during testing.
         */
        files: [
            <% scripts.forEach( function ( file ) { %>'<%= file %>',
            <% }); %>
            'build/tests/unit/**/*.spec.js'
        ],

    frameworks: [ 'jasmine' ],
    plugins: [ 'karma-jasmine', 'karma-phantomjs-launcher' ],
    preprocessors: {
      '**/*.coffee': 'coffee'
    },

    reporters: 'dots',

    port: 9018,
    runnerPort: 9100,
    urlRoot: '/',
    autoWatch: false,
    browsers: [
      'PhantomJS'
    ]
  });
};