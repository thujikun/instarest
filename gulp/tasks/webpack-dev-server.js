'use strict';

var gulp = require('gulp'),
    g = require('gulp-load-plugins')({lazy: false}),
    webpack = require('webpack'),
    WebpackDevServer = require("webpack-dev-server"),
    config = require('../config');

gulp.task("webpack-dev-server", ['statics'], function(callback) {
    // Start a webpack-dev-server
    var compiler = webpack(config.webpackDev);

    new WebpackDevServer(compiler, config.webpackDevServer).listen(9000, "localhost", function(err) {
        if(err) throw new g.util.PluginError("webpack-dev-server", err);

        gulp.src('./app/index.html')
            .pipe(g.open('', {url: 'http://localhost:9000/webpack-dev-server/index.html'}));

        // keep the server alive or continue?
        // callback();
    });
});