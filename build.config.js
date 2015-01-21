/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {


    build_dir: 'build',

    src_dir: 'src',

    dist_dir: 'dist',

    report_dir: 'reports',


    /**
     * This is a collection of file patterns that refer to our app code (the
     * stuff in `src/`). These file paths are used in the configuration of
     * build tasks. `js` is all project javascript, less tests. `ctpl` contains
     * our reusable components' (`src/common`) template HTML files, while
     * `atpl` contains the same, but for our app's code. `html` is just our
     * main HTML file, `less` is our main stylesheet, and `unit` contains our
     * app's unit tests.
     */
    app_files: {
        js_files: [ 'src/**/*.js', '!src/**/*.spec.js' ],
        concat_js_files: [ 'build/src/**/*.js', '!build/src/**/fwk-bootstrap.js'], //Pointe sur les sources js pré-minifiés dans le répertoire build_dir
        js: [ 'commun/**/*.js', 'views/**/*.js' ], //source js du projet avec tests
        all_js: [ 'src/commun/**/*.js' , 'src/views/**.*.js'],
        jsunit: ['src/**/*.spec.js'],
        mock: {
            json: [ '**/*.json']
        },
        tpl: ['src/views/**/*.tpl.html']
    },

    /**
     * This is a collection of files used during testing only.
     */
    test_files: {
        js: [
            'vendor/angular-mocks/angular-mocks.js'
        ]
    },

    /**
     * This is the same as `app_files`, except it contains patterns that
     * reference vendor code (`vendor/`) that we need to place into the build
     * process somewhere. While the `app_files` property ensures all
     * standardized files are collected for compilation, it is the user's job
     * to ensure non-standardized (i.e. vendor-related) files are handled
     * appropriately in `vendor_files.js`.
     *
     * The `vendor_files.js` property holds files to be automatically
     * concatenated and minified with our project source files.
     *
     * The `vendor_files.css` property holds any CSS files to be automatically
     * included in our app.
     *
     * The `vendor_files.assets` property holds any assets to be copied along
     * with our app's assets. This structure is flattened, so it is not
     * recommended that you use wildcards.
     */
    vendor_files: {
        js: [
            'vendor-bower/angular/angular.js',
            'vendor-bower/angular-resource/angular-resource.js',
            'vendor-bower/angular-sanitize/angular-sanitize.js',
            'vendor-bower/angular-i18n/angular-locale_fr-fr.js',
            'vendor-svn/angular-local-storage/angular-local-storage.js'
        ],
        mock: [
            'vendor-bower/angular-mocks/angular-mocks.js'
        ],
        css: [

        ]
    },

    /**
     * Lister ici les dépendances aux autres modules CDC Angular
     * Ces dépendances sont traités par Bower (en cible) de la même manière que les APIs externes
     * et ramener dans vendor-bower, ou éventuellement simplement posés dans vendor-svn pendant le dev
     *
     * Par contre, ces fichiers ne vont pas être minifié et concatener avec les autres APIs
     */
    cdc_modules: {
        js: [
        ],
        css: [
        ]
    }
};
