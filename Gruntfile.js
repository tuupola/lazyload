module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        uglify : {
            options: {
                banner: "/*! Lazy Load <%= pkg.version %> - MIT license - Copyright 2010-2013 Mika Tuupola */\n"
            },
            target: {
                files: {
                    "jquery.lazyload.min.js" : "jquery.lazyload.js",
                    "jquery.scrollstop.min.js" : "jquery.scrollstop.js"
                }
            }
        },
        watch: {
            files: ["*.js", "!*.min.js" ,"test/spec/*Spec.js"],
            tasks: ["test"],
        },
        jshint: {
            files: ["*.js", "!*.min.js" ,"test/spec/*Spec.js"],
            options: {
                jshintrc: ".jshintrc"
            }
        },
        jasmine: {
            src: ["jquery.lazyload.js"],
            options: {
                helpers: "test/spec/*Helper.js",
                specs: "test/spec/*Spec.js",
                vendor: ["test/vendor/jquery-1.9.0.js", "test/vendor/jasmine-jquery.js"]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-jasmine");
    grunt.loadNpmTasks("grunt-contrib-watch");

    //grunt.registerTask("test", ["jshint", "jasmine"]);
    grunt.registerTask("test", ["jshint"]);
    grunt.registerTask("default", ["test", "uglify"]);

};