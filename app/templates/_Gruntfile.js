module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            js: {
                src: [
                    'assets/js/vendor/jquery-1.11.0.min.js',
                    'bower_components/bootstrap/dist/js/bootstrap.min.js',
                    'assets/js/vendor/jquery.validate.min.js',
                    'assets/js/vendor/jrespond.min.js',
                    'assets/js/vendor/owl.carousel.min.js',
                    'assets/js/vendor/ScrollToPlugin.min.js',
                    'assets/js/vendor/TweenMax.min.js',
                    'assets/js/vendor/waypoints.min.js',
                    'assets/js/main.js'
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
                    paths: ["css"],
                    cleancss: false
                },
                files: {
                    "assets/css/<%= pkg.name %>.css": "assets/css/main.less"
                }
            },
            production: {
                options: {
                    paths: ["css"],
                    cleancss: true
                },
                files: {
                    "assets/css/<%= pkg.name %>.min.css": "assets/css/main.less"
                }
            }
        },
        watch: {
            files: ['Gruntfile.js','assets/css/*.less', 'assets/js/vendor/*.js','assets/js/main.js'],
            tasks: ['build'],
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

    grunt.registerTask('test', ['jshint', 'concat']);
    grunt.registerTask('default', ['jshint','less:development', 'concat']);
    grunt.registerTask('build', ['jshint', 'less', 'concat', 'uglify']);
    grunt.registerTask('cssonly', ['less:development']);
};
