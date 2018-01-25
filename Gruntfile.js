module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        compass: {
            main: {
                options: {
                    httpPath: '/',
                    cssPath: 'src/main/resources/public',
                    sassPath: 'src/main/resources/public',
                    // imagesDir: 'images',
                    // httpGeneratedImagesPath: '/static/images',
                    // httpImagesPath: '/static/images',

                    // fontsDir: '<%= cfg.fonts %>',
                    // httpFontsPath: './scss/fonts',

                    // environment: 'production',
                    outputStyle: 'compressed'
                }
            }
        },
        watch: {
            compass: {
                files: [
                    'src/main/resources/public/**/*.scss', 'src/main/resources/public/**/*.sass'
                ],
                tasks: ['compass']
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['compass', 'watch']);

};