
module.exports = function (grunt) {
    "use strict";


    // Project configuration.
    grunt.initConfig({

        typescript: {
            base: {
                src: ["./src/**/*.ts"],
                dest: "./lib",
                options: {
                    module: "commonjs", //or commonjs
                    target: "es5", //or es3
                    sourceMap: false,
                    declaration: false
                }
            }
        },
        watch: {
            typescript: {
                files: "./src/**/*.ts",
                tasks: ["typescript"],
                options: {
                    spawn: false,
                    interrupt: true
                }
            }
        }

    });

    grunt.loadNpmTasks("grunt-typescript");
    grunt.loadNpmTasks("grunt-contrib-watch");

    // avoid conflicts
    //grunt.renameTask("watch", "fsWatch");
    grunt.registerTask("watch", [
        "typescript",
        "watch"
    ]);

    // Default task.
    grunt.registerTask("default", [
        "typescript"
    ]);
};
