module.exports = function (grunt) {
    "use strict";


    // Project configuration.
    grunt.initConfig({

        ts: {
            default: {
                src: ["src/**/*.ts", "!src/refs/**/*.ts"],
                outDir: "./lib",
                watch: "src/",
                options: {
                    module: "commonjs",
                    sourceMap: false,
                    target: "es5"
                }

            }
        }

    });

    grunt.loadNpmTasks("grunt-ts");

    // Default task.
    grunt.registerTask("default", [
        "ts"
    ]);
};
