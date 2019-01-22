/// <binding BeforeBuild='clean, sass, js:scripts, concat:lib, min' />
"use strict";
 
var gulp = require("gulp"),
    sass = require("gulp-sass"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify");
 
var paths = {
    webroot: "./wwwroot/"
};

paths.js = paths.webroot + "js/**/*.js";
paths.lib = paths.webroot + "lib/**/*.js";
paths.minJs = paths.webroot + "js/**/*.min.js";
paths.minLib = paths.webroot + "lib/**/*.min.js";
paths.css = paths.webroot + "css/**/*.css";
paths.minCss = paths.webroot + "css/**/*.min.css";
paths.concatJsDest = paths.webroot + "js/site.min.js";
paths.concatLibDest = paths.webroot + "Lib/craftbook.min.js";
paths.concatCssDest = paths.webroot + "css/site.min.css";
paths.scripts = "./Scripts/*.js";
paths.classes = "./Scripts/Classes/*.js";
//надо переделать, возможно, в виде списка задачек очистки
gulp.task("clean:js", function (cb) {
    rimraf(paths.concatJsDest, cb);
    rimraf(paths.js, cb);
    rimraf(paths.lib, cb);
});

gulp.task("clean:css", function (cb) {
    rimraf(paths.concatCssDest, cb);
});

gulp.task("clean", ["clean:js", "clean:css"]);

gulp.task("concat:lib", function() {
    return gulp.src(paths.classes)
        .pipe(concat('craftbook.js'))
        .pipe(gulp.dest(paths.webroot + "lib/"));
});

gulp.task("js:scripts", function() {
    return gulp.src(paths.scripts)
        .pipe(gulp.dest(paths.webroot + "js/"));
});

gulp.task("js", ["clean:js", "js:scripts", "concat:lib"]);

gulp.task("min:js", function () {
    return gulp.src([paths.js, "!" + paths.minJs], { base: "." })
        .pipe(concat(paths.concatJsDest))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("min:lib", function () {
    return gulp.src([paths.lib, "!" + paths.minLib], { base: "." })
        .pipe(concat(paths.concatLibDest))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("sass", function () {
    return gulp.src('Styles/site.scss')
        .pipe(sass())
        .pipe(gulp.dest(paths.webroot + '/css'));
});

gulp.task("min:css", function () {
    return gulp.src([paths.css, "!" + paths.minCss])
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task("min", ["min:lib", "min:js", "min:css"]);