var gulp = require('gulp');

gulp.task('serve', ['compile', 'webpack-dev-server', 'watch']);