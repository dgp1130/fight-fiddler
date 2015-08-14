module.exports = function (grunt) {
	// Grunt configuration
	grunt.initConfig({
		jshint: {
			server: [ "src/*.js" ],
			client: [ "www/*.js" ]
		},
		
		nodeunit: {
			server: [ "test/server/*.js" ],
			client: [ "test/client/*.js" ]
		},
		
		preprocess: {
			options: {
				inline: true
			},
			prod: {
				options: {
					context: {
						TEST: false
					}
				},
				src: "build/*.js"
			},
			test: {
				options: {
					context: {
						TEST: true
					}
				},
				src: "build/*.js"
			}
		},
		
		shell: {
			run: {
				command: "node build/app.js"
			},
			cpServer: {
				command: "cp src/app.js src/util.js src/constants.js build/"
			},
			reporter: {
				command: "nodeunit --reporter html <%= nodeunit.client %> <%= nodeunit.server %>",
				options: {
					failOnError: false,
					callback: function (err, stdout, stderr, cb) {
						grunt.tasks("shell:bcat:" + encodeURIComponent(stdout));
						cb();
					},
					stdout: false
				}
			},
			bcat: {
				command: function (html) {
				    return "echo \"" + decodeURIComponent(html) + "\" | bcat";
				}
			}
		}
	});
	
	// Load Grunt tasks
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-nodeunit");
	grunt.loadNpmTasks("grunt-preprocess");
	grunt.loadNpmTasks("grunt-shell");

	// Load aliases
	grunt.registerTask("test", [ "jshint", "shell:cpServer", "preprocess:test", "nodeunit" ]);
	grunt.registerTask("reporter", [ "shell:reporter" ]);
	grunt.registerTask("serve", [ "shell:cpServer", "preprocess:prod", "shell:run" ]);
	grunt.registerTask("default", [ "serve" ]);
};