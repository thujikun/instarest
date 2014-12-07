var gulp = require('gulp'),
    g = require('gulp-load-plugins')({lazy: false}),
    config = require('../config');

gulp.task('webpack', function () {
    g.webpack(config.webpack)
        .pipe(gulp.dest(config.js.dest));
});