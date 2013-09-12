module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'), // the package file to use

    nodeunit: {
      all: ['test/*.test.js']
    },

    watch: {
      reports: {
        files: ['reports/*.json', 'reports/*.html'],
        options: {
          livereload: 1337
        }
      },
      test: {
        files: ['test/*.js', 'test/*.html', '*.js'],
        tasks: ['nodeunit']
      }
    }

  });

  // load up your plugins
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // register one or more task lists (you should ALWAYS have a "default" task list)
  grunt.registerTask('default', ['nodeunit']);

};