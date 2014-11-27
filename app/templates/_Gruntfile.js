module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            js: {
                src: [
                    'src/bower_components/bootstrap/dist/js/bootstrap.min.js',
                    'src/js/vendor/ScrollToPlugin.min.js',
                    'src/js/vendor/TweenMax.min.js',
                    'src/js/main.js'
                ],
                dest: 'assets/js/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'assets/js/<%= pkg.name %>.min.js': ['<%= concat.js.dest %>']
                }
            }
        },
        jshint: {
            files: ['Gruntfile.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        less: {
            development: {
                options: {
                    paths: ["css"],
                    cleancss: false
                },
                files: {
                    "assets/css/<%= pkg.name %>.css": "src/ess/main.less"
                }
            },
            production: {
                options: {
                    paths: ["css"],
                    cleancss: true
                },
                files: {
                    "assets/css/<%= pkg.name %>.min.css": "src/less/main.less"
                }
            }
        },
        image_resize: {
            base: {
                options: {
                    width: '50%',
                    height: '50%',
                    overwrite: true
                },
                src: 'src/img/sprite/2x/*.png',
                dest: 'src/img/sprite/base/'
            }
        },
        sprite: {
            "base": {
                src: ['src/img/sprite/*.png'],
                destImg: 'src/img/sprite.png',
                destCSS: 'src/less/sprite.less',
                imgPath: '../img/sprite.png',
                algorithm: 'binary-tree',
                padding: 1,
                engine: 'auto',
                cssFormat: 'less',
                cssTemplate: 'src/lib/templates/less.template.mustache'
            }/*,
            "2x":{
                src: ['img/sprite/2x/*.png'],
                destImg: 'img/sprite@2x.png',
                destCSS: 'less/sprite2x.less',
                imgPath: '../img/sprite@2x.png',
                algorithm: 'binary-tree',
                padding: 2,
                engine: 'auto',
                cssFormat: 'less',
                cssTemplate: 'lib/templates/less.template.mustache',
                cssOpts: {
                    variableModifier:'-2x'
                }
            }
            */
        },
        pngmin: {
            compile: {
                options: {
                    ext: '.png',
                    force: true
                },
                files: [
                    {
                        src: 'src/img/sprite@2x.png',
                        dest: 'assets/img/sprite@2x.png'
                    },
                    {
                        src: 'src/img/sprite.png',
                        dest:'assets/img/sprite.png'
                    }
                ]

            }
        },
        watch: {
            files: ['Gruntfile.js', 'src/less/*.less', 'src/js/vendor/*.js', 'src/js/main.js'],
            tasks: ['production'],
            options: {
                livereload: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-spritesmith');
    grunt.loadNpmTasks('grunt-image-resize');
    grunt.loadNpmTasks('grunt-pngmin');

    grunt.registerTask('test', ['jshint', 'concat']);
    grunt.registerTask('default', ['jshint', 'less', 'concat']);
    grunt.registerTask('production', ['jshint', 'less', 'concat', 'uglify']);
    grunt.registerTask('build', ['jshint', 'image_resize', 'sprite','pngmin', 'less', 'concat', 'uglify']);
    grunt.registerTask('cssonly', ['less:development']);
};
