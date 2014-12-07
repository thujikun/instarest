var gulp = require('gulp'),
    g = require('gulp-load-plugins')({lazy: false}),
    config = require('../config').cssmin;;

gulp.task('cssmin', ['stylus'], function () {
    gulp.src(config.src)
        .pipe(g.cssmin(config))
        .pipe(gulp.dest(config.dest));
});