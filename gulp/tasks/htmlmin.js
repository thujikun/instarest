var gulp = require('gulp'),
    g = require('gulp-load-plugins')({lazy: false}),
    config = require('../config').htmlmin;;

gulp.task('htmlmin', ['ect-dist'], function () {
    gulp.src(config.src)
        .pipe(g.htmlmin(config))
        .pipe(gulp.dest(config.dest));
});