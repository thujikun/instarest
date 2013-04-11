requirejs.config({
    paths: {
        jquery: 'lib/jquery-1.9.1.min',
        underscore: 'lib/underscore-1.4.4.min',
        backbone: 'lib/backbone-1.0.min',
        jqueryUI: 'lib/jquery-ui-1.10.0.custom.min',
        shapeshift: 'lib/jquery.shapeshift.min',
        myplugin: 'self/myplugin'
    },
    shim: {
        'jquery': {
            exports: '$'
        },
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        'jqueryUI': {
            deps: ['jquery']
        },
        'shapeshift': {
            deps: ['jquery', 'jqueryUI']
        },
        'myplugin': {
            deps: ['jquery']
        }
    }
});


require([
    'self/models',
    'self/views'
], function(models, views) {
    new views.InstagramListView({
        collection: new models.InstagramCollection()
    });
});

