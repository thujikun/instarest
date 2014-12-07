'use strict';

var gulp = require('gulp'),
    g = require('gulp-load-plugins')({lazy: false}),
    config = require('../config').watch;

gulp.task("watch", function() {
    g.watch(config.styl, function() {
        gulp.start(['stylus']);
    });
    g.watch(config.views, function() {
        gulp.start(['ect']);
    });
});