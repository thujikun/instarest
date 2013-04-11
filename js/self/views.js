define([
    'jquery',
    'underscore',
    'backbone',
    'self/models',
    'shapeshift',
    'myplugin'
], function($, _, Backbone, models) {
    var InstagramListView,
        InstagramView,
        CommentListView;

    //Instagramの写真のView
    InstagramListView = Backbone.View.extend( {
        // このviewのwrapper
        el: '#instarest',

        //イベント定義
        events: {
            //カスタムスクロールイベント
            'scrollEnd': 'getInstagram'
        },

        //初期処理。newするとまずこれが動く
        initialize: function() {
            var self = this;

            //Instagramの写真を取得した時のイベントリスナを設定
            self.collection.on('add', self.renderInstagram, self);

            //処理中フラグを下げる
            self.processing = false;

            //写真リスト取得
            self.getInstagram().done(function() {
                //この要素が下までスクロールしたらイベント発火
                self.$el.scrollEnd();
            });

        },

        //写真リスト取得処理
        getInstagram: function() {
            var self = this,
                dfd = $.Deferred();

            //処理中の場合何もしない
            if(self.processing) {
                return false;
            }
            //処理中フラグを立てる
            self.processing = true;

            //写真リスト取得
            self.collection.fetch({
                dataType: 'jsonp'
            }).done(function() {
                //処理中フラグを下げる
                self.processing = false;
                //doneを実行
                dfd.resolve();
                //並び替える
                self.layout();
            });

            return dfd.promise();
        },

        //テンプレート
        template: _.template($('#instarest-template').html()),

        //写真リストをレンダリング
        renderInstagram: function(model) {
            var html = [],
                data,
                item;

            data = model.toJSON();
            item = $($.parseHTML(this.template(data)));
            this.$el.append(item);

            //写真ごとのviewを作成
            new InstagramView( {
                root: this,
                el: $('#' + data.id),
                model: model
            });

            //時間をいい感じに表示
            item.find('.time').magicTime();

            //コメントエリアをリサイズ可能に設定
            item.find('.comment-text').resizeTextarea();

            return this;
        },

        //並び替え処理
        layout: function() {
            this.$el.shapeshift({
                enableAnimationOnInit: true
            });
        }
    });

    InstagramView = Backbone.View.extend( {

        //イベント定義
        events: {
            //コメント投稿フォームのsubmit処理にイベントリスナを設定
            'submit .comment-form': 'onSubmitComment'
        },

        //初期処理
        initialize: function(options) {
            //親のviewを保持
            this.root = options.root;

            //コメントmodelのリストを作成
            this.commentListCollection = new models.CommentListCollection();

            //コメントのviewを作成
            new CommentListView( {
                el: this.$el.find('.comment-list'),
                collection: this.commentListCollection
            });
        },

        //コメントフォームサブミット時処理
        onSubmitComment: function(e) {
            var form = $(e.target),
                commentModel = new models.CommentModel( {
                    id: idCreator.getId(),
                    text: form.find('.comment-text').val(),
                    created_time: Math.floor(new Date().getTime() / 1000) + ''
                });

            //コメントmodelをリストに追加
            this.commentListCollection.add(commentModel);
            form.find('.comment-text').val('');

            //並び替え
            this.root.layout();
            e.preventDefault();
        }
    });

    //コメントリストのview
    CommentListView = Backbone.View.extend( {

        template: _.template($('#instarest-comment-template').html()),

        //初期処理
        initialize: function() {
            //コメント追加のイベントリスナにコメントのレンダリング処理を設定
            this.collection.on('add', this.render, this);
        },

        //コメントレンダリング処理
        render: function(model) {

            //レンダリング
            this.$el.append(this.template(model.toJSON()));

            //時間をいい感じに表示
            this.$el.find('.time').magicTime();

            return this;
        }

    });

    return {
        InstagramListView: InstagramListView,
        InstagramView: InstagramView,
        CommentListView: CommentListView
    };

});