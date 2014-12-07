(function() {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Masonry = require('masonry'),
        imagesLoaded = require('imagesLoaded'),
        defineProp = require('define-property'),
        InstarestView = function() {
            this._constructor.apply(this, arguments);
        },
        ACCESS_TOKEN = '144784204.1cf1905.1da25a7e3bf548a38642c7542d2e03bb';

    require('jquery.dotdotdot');
    require('position-listener');

    defineProp(InstarestView.prototype, 'template', _.template(require('item-template.html')));

    defineProp(InstarestView.prototype, '_constructor', function($el) {
        this.$el = $el;
        this.offset = 0;
        this.limit = 20;
        this.$list = this.$el.find('.item-list');
        this.$footer = this.$el.find('.item-footer');
        this.get();
    });

    defineProp(InstarestView.prototype, 'get', function() {
        var that = this;
        $.ajax({
            type: 'get',
            url: 'https://api.instagram.com/v1/media/popular',
            dataType: 'jsonp',
            data: {
                count: this.limit,
                access_token: ACCESS_TOKEN,
                offset: this.offset
            }
        })
            .then(function(response) {
                that._render(that._parse(response));
            });
        this.$footer.addClass('loading');
    });

    defineProp(InstarestView.prototype, '_parse', function(response) {
        return response.data;
    });

    defineProp(InstarestView.prototype, '_render', function(itemList) {
        var that = this;

        that._renderItem(itemList)
            .then(function() {
                that.$footer.removeClass('loading');
                if (itemList.length === that.limit) {
                    that.offset += itemList.length;
                    that.$footer.addPositionListener(-1200, that.get.bind(that), true);
                }
            });
    });

    defineProp(InstarestView.prototype, '_renderItem', function(itemList) {
        var that = this,
            html = [],
            list = that.$list.get(0),
            dfd = $.Deferred(),
            commentTmpl = require('comment-template.html');

        itemList.forEach(function(item) {
            item.commentTmpl = commentTmpl;
            html.push(that.template(item));
        });

        requestAnimationFrame(function() {
            that.$list.append(html.join(''));

            that.$list.find('.js-dotdotdot').dotdotdot({
                wrap: 'letter'
            });

            imagesLoaded(list, function() {
                that.masonry = new Masonry(list, {
                    isFitWidth: true
                });
                that.$list.find('.item').addClass('active');

                dfd.resolve();
            });
        });

        return dfd.promise();
    });

    module.exports = InstarestView;

}.call(this));