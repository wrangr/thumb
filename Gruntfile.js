/* global module:false */

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Project configuration.
  grunt.initConfig({

    jshint: {
      all: [
        'Gruntfile.js',
        'index.js',
        'examples/**/*.js',
        'test.js'
      ]
    },

    nodeunit: {
      all: [ 'test.js' ]
    }

  });

  // Default task.
  grunt.registerTask('default', [ 'jshint', 'nodeunit' ]);

};

