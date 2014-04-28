module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    protractor: {
      options: {
        configFile: "conf.js", // Default config file
        keepAlive: true, // If false, the grunt process stops when the test fails.
        noColor: false, // If true, protractor will not use colors in its output.
        args: {
          'browser': 'chrome'
        }
      },
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
        },
        src: ['test/server/**/*.spec.js']
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
      },
      server: {
        src: [ 'server/**/*.js']
      },
      client: {
        src: [ 'client/src/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      }
    },
    jasmine: {
      pivotal: {
        src: 'client/src/**/*.js',
        options: {
          specs: 'test/client/unit/**/*.spec.js',
          vendor: [
            'client/vendor/angular/angular.js',
            'client/vendor/angular-mocks/angular-mocks.js',
            'client/vendor/angular-resource/angular-resource.js',
            'client/vendor/angular-cookies/angular-cookies.js',
            'client/vendor/angular-sanitize/angular-sanitize.js',
            'client/vendor/angular-route/angular-route.js',
          ]
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
      }
    }
  });

  grunt.registerTask('client', function () {
    grunt.task.run([
      'karma'
    ]);
  });

  grunt.registerTask('server', function () {
    grunt.task.run([
      'mochaTest'
    ]);
  });

  grunt.registerTask('test', function () {
    grunt.task.run([
      'jshint',
      'server',
      'jasmine'
    ]);
  });

  grunt.registerTask('testDeep', function () {
    grunt.task.run([
      'jshint',
      'server',
      'client'
    ]);
  });

};