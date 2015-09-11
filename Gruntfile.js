module.exports = function (grunt) {
    'use strict';

    // var path = require("path");

    // Load NPM tasks
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks("grunt-bower-install-simple");

    // Init GRUNT configuraton
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        'bower-install-simple': {
            options: {
                color:       true,
                production:  false,
                directory:   "bower_components"
            }
        },
        less: {
            development: {
                options: {
                    compress: false,
                    yuicompress: false,
                    optimization: 2
                },
                files: {
                    "client_mobile/prod/styles.css": "client_mobile/dev/less/**/*.less",
                    "client_display/prod/styles.css": "client_display/dev/less/**/*.less",
                }
            }
        },
        requirejs: {
            compile_mobile: {
                options: {
                    name: 'app',
                    baseUrl: "client_mobile/dev/js",
                    out: "client_mobile/prod/app.js",
                    preserveLicenseComments: false,
                    optimize: "uglify", //"uglify",
                    include: ["requireLib"],
                    paths: {
                        "requireLib": '../../../bower_components/requirejs/require',
                        "text": '../../../bower_components/requirejs-text/text',
                        "domReady": '../../../bower_components/domReady/domReady',
                        "socketio": '../../../node_modules/socket.io/node_modules/socket.io-client/socket.io'
                    },
                }
            },
            compile_display: {
                options: {
                    name: 'app',
                    baseUrl: "client_display/dev/js",
                    out: "client_display/prod/app.js",
                    preserveLicenseComments: false,
                    optimize: "uglify", //"uglify",
                    include: ["requireLib"],
                    paths: {
                        "requireLib": '../../../bower_components/requirejs/require',
                        "text": '../../../bower_components/requirejs-text/text',
                        "domReady": '../../../bower_components/domReady/domReady',
                        "socketio": '../../../node_modules/socket.io/node_modules/socket.io-client/socket.io'
                    },
                }
            }
        },
        jasmine: {
            commons: {
                options: {
                    specs: "tests/specs/**/*.js",
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfig: {
                            baseUrl: './'
                        }
                    }
                }
            }
        },
        watch: {
            scripts: {
                files: ['client_mobile/dev/**/*.*', 'client_display/dev/**/*.*'],
                tasks: ['build'],
            },
        }
    });

    grunt.registerTask("bower-install", [ "bower-install-simple" ]);

    // Build
    grunt.registerTask('build', [
        'bower-install',
        'less',
        'requirejs'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};