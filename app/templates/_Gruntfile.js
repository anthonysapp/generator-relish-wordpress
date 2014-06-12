module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            js: {
                src: [
                    'src/js/vendor/jquery-1.11.0.min.js',
                    'bower_components/bootstrap/dist/js/bootstrap.min.js',
                    'src/js/vendor/jquery.validate.min.js',
                    'src/js/vendor/jrespond.min.js',
                    'src/js/vendor/owl.carousel.min.js',
                    'src/js/vendor/ScrollToPlugin.min.js',
                    'src/js/vendor/TweenMax.min.js',
                    'src/js/vendor/jquery.inview.js',
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
                    'src/js/<%= pkg.name %>.min.js': ['<%= concat.js.dest %>']
                }
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
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
                    paths: ["less"],
                    cleancss: false
                },
                files: {
                    "assets/css/<%= pkg.name %>.css": "assets/less/main.less"
                }
            },
            production: {
                options: {
                    paths: ["css"],
                    cleancss: true
                },
                files: {
                    "assets/css/<%= pkg.name %>.min.css": "assets/less/main.less"
                }
            }
        },
        sprite: {
            all: {
                // Sprite files to read in
                src: ['src/img/sprite/*'],

                // Location to output spritesheet
                destImg: 'src/img/sprite.png',

                // Stylus with variables under sprite names
                destCSS: 'src/less/sprite.less',

                // OPTIONAL: Manual override for imgPath specified in CSS
                imgPath: '../img/sprite.png',

                // OPTIONAL: Specify algorithm (top-down, left-right, diagonal [\ format],
                // alt-diagonal [/ format], binary-tree [best packing])
                // Visual representations can be found below
                algorithm: 'binary-tree',

                // OPTIONAL: Specify padding between images
                padding: 2,

                // OPTIONAL: Specify engine (auto, phantomjs, canvas, gm, pngsmith)
                engine: 'auto',

                // OPTIONAL: Specify CSS format (inferred from destCSS' extension by default)
                // (stylus, scss, scss_maps, sass, less, json, json_array, css)
                cssFormat: 'less',



                // OPTIONAL: Specify settings for algorithm
                algorithmOpts: {
                    // Skip sorting of images for algorithm (useful for sprite animations)
                    //sort: false
                },

                // OPTIONAL: Specify css options
                cssOpts: {
                    // Some templates allow for skipping of function declarations
                    functions: true,

                    // CSS template allows for overriding of CSS selectors
                    cssClass: function (item) {
                        return '.sprite-' + item.name;
                    }
                }
            }
        },
        pngmin: {
            compile: {
                options: {
                    ext: '.png',
                    force: true
                },
                files: [
                    {
                        src: 'src/img/sprite.png',
                        dest: 'assets/img/'
                    }
                ]
            }
        },
        watch: {
            files: ['Gruntfile.js','src/less/*.less', 'src/js/vendor/*.js','src/js/main.js'],
            tasks: ['default'],
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
    grunt.loadNpmTasks('grunt-pngmin');

    grunt.registerTask('test', ['jshint', 'concat']);
    grunt.registerTask('default', ['jshint','less:development', 'concat']);
    grunt.registerTask('build', ['jshint', 'sprite','pngmin', 'less', 'concat', 'uglify']);
    grunt.registerTask('cssonly', ['less:development']);
};
