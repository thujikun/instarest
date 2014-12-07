var gulp = require('gulp'),
    g = require('gulp-load-plugins')({lazy: false}),
    config = require('../config').statics;

gulp.task('statics', g.serve(config));