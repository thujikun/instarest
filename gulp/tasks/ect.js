var gulp = require('gulp'),
    g = require('gulp-load-plugins')({lazy: false});

gulp.task('ect', function () {
    var config = require('../config').ectDev;
    gulp.src(config.src)
        .pipe(g.ect(config))
        .pipe(gulp.dest(config.dest));
});

gulp.task('ect-dist', function () {
    var config = require('../config').ect;
    gulp.src(config.src)
        .pipe(g.ect(config))
        .pipe(gulp.dest(config.dest));
});