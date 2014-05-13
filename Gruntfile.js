module.exports = function(grunt) {

    grunt.initConfig({
        watch: {
            fest: {
                files: ['templates/*.xml'],
                tasks: ['fest'],
                options: {
                    atBegin: true
                }
            },
            sass: {
                files: ['public/css/*.scss'],
                tasks: ['sass'],
                options: {
                    atBegin: true
                }
            },
            autoprefixer: {
                files: ['public/css/*.css'],
                tasks: ['autoprefixer:dev', 'autoprefixer:dev_joystick'],
                options: {
                    atBegin: true
                }
            },
            express: {
                files: ['routes/**/*.js', 'app.js'],
                tasks: ['express'],
                options: {
                    spawn: false
                }
            },
            server: {
                files: ['public/js/**/*.js',
                    'public/css/**/*.css'
                ],
                options: {
                    interrupt: true,
                    livereload: true
                }
            }
        },
        express: {
            server: {
                options: {
                    livereload: true,
                    port: 8000,
                    script: 'app.js'
                }
            }
        },
        fest: {
            templates: {
                files: [{
                    expand: true,
                    cwd: 'templates',
                    src: '*.xml',
                    dest: 'public/js/tmpl'
                }],
                options: {
                    template: function(data) {
                        return grunt.template.process('define(function () {return <%= contents %> ; });', {
                            data: data
                        });
                    }
                }
            }
        },
        sass: {
            css: {
                files: [{
                    expand: true,
                    cwd: 'public/css',
                    src: '*.scss',
                    dest: 'public/css',
                    ext: '.css'
                }]
            }
        },
        requirejs: {
            build: {
                options: {
                    almond: true,
                    baseUrl: "public/js",
                    mainConfigFile: "public/js/main.js",
                    name: "main",
                    optimize: "none",
                    out: "public/js/build/main.js" 
                }
            },
            build_joystick: {
                options: {
                    almond: true,
                    baseUrl: "public/js",
                    mainConfigFile: "public/js/main_joystick.js",
                    name: "main_joystick",
                    out: "public/js/build/main_joystick.js"
                }
            }
        },
        concat: {
            build: {
                options: {
                    separator: ';\n'
                },
                src: ['public/js/lib/almond.js','public/js/build/main.js'],
                dest: 'public/js/build.js'
            },
            build_joystick: {
                options: {
                    separator: ';\n'
                },
                src: ['public/js/lib/almond.js', 'public/js/build/main_joystick.js'],
                dest: 'public/js/build_joystick.js'
            }
        },
        uglify: {
            build: {
                files: [{
                    src: ['public/js/build.js'],
                    dest: 'public/js/build.min.js'
                }]
            },
            build_joystick: {
                files: [{
                    src: ['public/js/build_joystick.js'],
                    dest: 'public/js/build_joystick.min.js'
                }]
            }
        },
        autoprefixer: {
            build:{
                options: {
                    browsers: ['last 2 version', 'ie 8', 'ie 9']
                },
                src: 'public/css/main.css',
                dest: 'public/css/main.css'
            },
            build_joystick: {
                options: {
                    browsers: ['last 2 version', 'ie 8', 'ie 9']
                },
                src: 'public/css/joystick.css',
                dest: 'public/css/joystick.css'
            },
            multiple_files: {
                expand: true,
                flatten: true,
                src: 'public/css/*.css',
                dest: 'public/css/' 
            },
            dev:{
                options: {
                    browsers: ['last 2 version', 'ie 8', 'ie 9']
                },
                src: 'public/css/main.css',
                dest: 'public/css/main.css'
            },
            dev_joystick: {
                options: {
                    browsers: ['last 2 version', 'ie 8', 'ie 9']
                },
                src: 'public/css/joystick.css',
                dest: 'public/css/joystick.css'
            }
        },
    });
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-fest');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-livereload');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-modernizr');

    grunt.registerTask('default', ['sass','express','watch']);
    grunt.registerTask('build', ['fest', 'requirejs:build','concat:build', 'uglify:build', 'autoprefixer:build']);
    grunt.registerTask('build_joystick', ['fest', 'requirejs:build_joystick', 'concat:build_joystick', 'uglify:build_joystick', 'autoprefixer:build_joystick'])
};