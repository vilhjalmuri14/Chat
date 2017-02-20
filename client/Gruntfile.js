module.exports = function ( grunt ) {
	var taskConfig = {
		tslint: {
			files: {
				src: [
					"src/**/*.ts",
					"src/**/*.spec.ts"
				]
			},
			gruntfile: ['Gruntfile.js'],
			options: {
				configuration: "tslint.json",
				globals: {
					jQuery: false,
					$: false
				},
				esversion: 6
			}
		}
	};

	grunt.loadNpmTasks("grunt-tslint");
	grunt.registerTask('default', ['tslint']); 
	grunt.initConfig(taskConfig);
};