
module.exports = function(grunt) {
	 var path = require('path');
	//load all tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: [
					'src/js/main.js',
				],
				dest: 'dist/js/<%= pkg.name %>-<%= pkg.version %>.js'
			}
		},
		uglify: {
			option: {
				mangle: false,
				beautify: true,
				banner: '/* <%=pkg.name %>-<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n'
			},
			dist: {
				files: {
					'dist/js/<%= pkg.name %>-<%= pkg.version %>.min.js': ['<%= concat.dist.dest %>']
				}
			}
		},
		jshint: {
			options: {
				reporter: require('jshint-stylish')
			},
			target: ['src/**/*.js']
		},
		cssmin: {
			target: {
				files: [{
					expand: true,
					cwd: 'src/css',
					src: ['*.css', '!*.min.css'],
					dest: 'dist/css',
					ext: '.min.css'
				}]
			}
		},
		//watch的内容是否需要增加
		watch: {
			scripts: {
				files: ['src/js/*.js'],
				tasks: ['jshint'],
				options: {
				spawn: false,
				},
		},
		copy: {
  			main: {
    			expand: true,
    			cwd: 'src/img/',
    			src: '**',
    			dest: 'dist/img/',
    			flatten: true,
    			filter: 'isFile',
  			},
		},
		//不知已有express,需不需要open？
		open: {
			server: {
                url: 'http://localhost:3000/index.html'
            }
		},
		express: {
			myLivereloadServer: {
				bases: path.resolve(__dirname, 'src'),
				livereload: true //default port `35729` will be used
			}
		}
	}
	});
	grunt.registerTask('test', ['jshint']);
	grunt.registerTask('build', ['test', 'concat', 'uglify', 'cssmin', 'copy' ]);
	grunt.registerTask('myServer', ['express', 'express-keepalive']);
	grunt.registerTask('default', ['build', 'watch']);
};
