module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'), // the package file to use
 
    nodeunit: {
      all: ['test/*.test.js']
    },

    qunit: {
      all: ['test/*.html']
    },

    watch: {
      files: ['test/*.js', 'test/*.html', '*.js'],
      tasks: ['nodeunit']
    }

  });
 
  // load up your plugins
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
 
  // register one or more task lists (you should ALWAYS have a "default" task list)
  grunt.registerTask('default', ['nodeunit']);

};