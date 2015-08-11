/*global module*/

var path = require('path');

module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mocha_istanbul: {
            coverage: {
                src: 'test', // a folder works nicely
                options: {
                    mask: '*.js'
                }
            }
        },
        jshint: {
            files: ['*.js', './lib/**/*.js', './test/**/*.js'],
            options: {
                browser: true,
                smarttabs: true,
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: false,
                boss: true,
                eqnull: true,
                node: true,
                expr: true,
                globals: {
                    'it': true,
                    'xit': true,
                    'describe': true,
                    'before': true,
                    'after': true,
                    'done': true
                }
            }
        },
        jsbeautifier: {
            beautify: {
                src: ['Gruntfile.js', 'lib/**/*.js', 'test/*.js', '*.js'],
                options: {
                    config: '.jsbeautifyrc'
                }
            },
            check: {
                src: ['Gruntfile.js', 'lib/*.js', 'test/*.js', '*.js'],
                options: {
                    mode: 'VERIFY_ONLY',
                    config: '.jsbeautifyrc'
                }
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    timeout: '10000'
                },
                src: ['test/*.js']
            }
        }
    });

    grunt.registerTask('beautify', ['jsbeautifier:beautify']);
    grunt.registerTask('mocha', ['mochaTest']);
    grunt.registerTask('coverage', ['mocha_istanbul:coverage']);

    grunt.registerTask('default', ['beautify', 'jshint', 'mocha']);

    grunt.registerTask('commit', ['jshint', 'mocha']);
    grunt.registerTask('timestamp', function () {
        grunt.log.subhead(Date());
    });
};
