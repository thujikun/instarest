var gulp = require('gulp'),
    path = require('path'),
    g = require('gulp-load-plugins')({lazy: false}),
    config = require('../config').stylus;

gulp.task('stylus', function () {
    gulp.src(config.src)
        .pipe(g.plumber())
        .pipe(g.stylus(config.stylus))
        .pipe(g.pleeease())
        .pipe(gulp.dest(config.dest));
});