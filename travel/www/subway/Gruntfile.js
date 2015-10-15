module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                separator: ';'
            },
            dist: {
            	 src: ['js/*.js'],//,
                 dest: 'build/js/main.js'
            }
        },
         
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['concat']);

};