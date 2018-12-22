/// <binding BeforeBuild='sass' />
"use strict";
 
var gulp = require("gulp"),
    sass = require("gulp-sass"); // ��������� ������ sass
 
var paths = {
    webroot: "./wwwroot/"
};
// ������������ ������ ��� ����������� ����� scss � css
gulp.task("sass", function () {
  return gulp.src('Styles/site.scss')
            .pipe(sass())
            .pipe(gulp.dest(paths.webroot + '/css'))
});