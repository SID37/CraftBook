/// <binding BeforeBuild='js, css, min:css' AfterBuild='js, css, min:css' />
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

gulp.task("clean:js", function (cb) {
    rimraf(paths.js, cb);
});

gulp.task("clean:lib", function (cb) {
    rimraf(paths.js, cb);
});

gulp.task("clean:min", function (cb) {
    rimraf(paths.concatJsDest, cb);
});

gulp.task("clean:css", function (cb) {
    rimraf(paths.concatCssDest, cb);
});

gulp.task("clean", ["clean:js", "clean:lib", "clean:min", "clean:css"]);

gulp.task("lib:concat", function() {
    return gulp.src(paths.classes)
        .pipe(concat('craftbook.js'))
        .pipe(gulp.dest(paths.webroot + "lib/"));
});

gulp.task("js:scripts", function() {
    return gulp.src(paths.scripts)
        .pipe(gulp.dest(paths.webroot + "js/"));
});

gulp.task("js", ["clean:js", "js:scripts", "lib:concat"]);

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

gulp.task("css", ["clean:css", "sass"]);

gulp.task("min:css", function () {
    return gulp.src([paths.css, "!" + paths.minCss])
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task("min", ["min:lib", "min:js", "min:css"]);
gulp.task('watch', function () {
    gulp.watch(paths.scripts, ["js:scripts"]);
    gulp.watch(paths.classes, ["lib:concat"]);
    gulp.watch('Styles/**/*.scss', ["sass"]);
});