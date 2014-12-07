// @file config.js

'use strict';

var webpack = require('webpack'),
    path = require('path'),
    dir = {
        dest: './dist',
        app: './app',
        js: './app/js',
        tmp: './.tmp'
    },
    current = process.cwd();

module.exports = {
    // destination
    dest: dir.dest,

    // apps
    app: dir.app,

    // temporary
    tmp: dir.tmp,

    // js
    js: {
        src: dir.js + '/**',
        dest: dir.dest + '/js'
    },

    // webpack
    webpack: {
        entry: {
            top: dir.js + '/main.js',
        },
        output: {
            filename: '[name].bundle.js',
            publicPath: '/assets/'
        },
        resolve: {
            extensions: ['', '.js'],
            root: [
                path.join(current, 'bower_components'),
                path.join(current, dir.js, 'modules'),
                path.join(current, dir.js, 'templates')
            ]
        },
        debug: false,
        devtool: false,
        stats: {
            colors: true,
            reasons: false
        },
        plugins: [
            new webpack.ResolverPlugin(
                new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('.bower.json', ['main'])
            ),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin(),
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.optimize.AggressiveMergingPlugin(),
            new webpack.ProvidePlugin({
                jQuery: "jquery",
                $: "jquery"
            })
        ],
        module: {
            loaders: [
                { test: /\.html$/, loader: 'html?minimize' }
            ]
        }
    },

    webpackDev: {
        entry: {
            top: dir.js + '/main.js',
        },
        output: {
            path: path.join(current, 'app',  'js'),
            filename: '[name].bundle.js',
            publicPath: 'js/'
        },
        resolve: {
            extensions: ['', '.js'],
            root: [
                path.join(current, 'bower_components'),
                path.join(current, dir.js, 'modules'),
                path.join(current, dir.js, 'templates')
            ]
        },
        cache: true,
        debug: true,
        devtool: false,
        stats: {
            colors: true,
            reasons: false
        },
        plugins: [
            new webpack.ResolverPlugin(
                new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('.bower.json', ['main'])
            ),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin(),
            new webpack.ProvidePlugin({
                jQuery: "jquery",
                $: "jquery"
            })
        ],
        module: {
            loaders: [
                { test: /\.html$/, loader: 'html?minimize' }
            ]
        }
    },

    // webpack-dev-server
    webpackDevServer: {
        contentBase: "http://localhost:3000",
        hot: true,
        quiet: false,
        noInfo: false,
        lazy: false,
        watchDelay: 300,
        publicPath: "http://localhost:9000/js/",
        stats: { colors: true }
    },

    stylus: {
        src: [
            dir.app + '/styl/**/*.styl',
            '!' + dir.app + '/styl/**/_*.styl',
        ],
        dest: path.join(current, dir.tmp, '/css/'),
        stylus: {
            use: [require('nib')()]
        }
    },

    statics: {
        port: 3000,
        root: [dir.tmp, dir.app]
    },

    ect: {
        src: [
            dir.app + '/views/**/*.ect',
            '!' + dir.app + '/views/layouts/**/*.ect'
        ],
        data: {
            dev: false
        },
        dest: dir.tmp
    },

    ectDev: {
        src: [
            dir.app + '/views/**/*.ect',
            '!' + dir.app + '/views/layouts/**/*.ect'
        ],
        data: {
            dev: true
        },
        dest: dir.tmp
    },

    htmlmin: {
        src: dir.tmp + '/**/*.html',
        removeComments: true,
        collapseWhitespace: true,
        removeEmptyAttributes: false,
        collapseBooleanAttributes: true,
        removeRedundantAttributes: true,
        dest: dir.dest
    },

    cssmin: {
        src: dir.tmp + '/css/**/*.css',
        dest: dir.dest + '/css'
    },

    watch: {
        styl: dir.app + '/styl/**',
        views: dir.app + '/views/**'
    }
}