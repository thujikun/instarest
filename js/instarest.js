!function($) {

    var idCreator = new function() {
        var id = 0;

        this.getId = function() {
            var returnId = id + '';
            id++;
            return returnId;
        };
    };

    $(function() {
        var InstagramModel,
            InstagramCollection,
            InstagramListView,
            InstagramView,
            CommentModel,
            CommentListCollection,
            CommentListView;

        //Instagramの写真ごとのmodel
        InstagramModel = Backbone.Model.extend({
            defaults: {
                new_comment: ''
            }
        });

        //Instagramの写真ごとのmodelの配列
        InstagramCollection = Backbone.Collection.extend( {

            url: 'https://api.instagram.com/v1/media/popular?count=20&access_token=144784204.1cf1905.1da25a7e3bf548a38642c7542d2e03bb',

            model: InstagramModel,

            parse: function(response) {
                return response.data;
            }
        });

        //Instagramの写真のView
        InstagramListView = Backbone.View.extend( {
            // このviewのwrapper
            el: '#instarest',

            //イベント定義
            events: {
                //カスタムスクロールイベント
                'scrollEnd': 'getInstagram'
            },

             model: InstagramModel,

            //初期処理。newするとまずこれが動く
            initialize: function() {
                var self = this;

                //Instagramの写真を取得した時のイベントリスナを設定
                self.collection.on('reset', self.renderInstagram, self);

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
                });

                return dfd.promise();
            },

            //テンプレート
            template: _.template($('#instarest-template').html()),

            //写真リストをレンダリング
            renderInstagram: function(collection) {
                var self = this,
                    html = [],
                    data,
                    commentModel;

                //写真ひとつひとつに対しての処理
                collection.each(function(model) {
                    data = model.toJSON();
                    self.$el.append(self.template(data));

                    //写真ごとのviewを作成
                    new InstagramView( {
                        root: self,
                        el: $('#' + data.id),
                        model: model
                    });
                });

                //並び替える
                self.layout();

                //時間をいい感じに表示
                self.$el.find('.time').magicTime();

                //コメントエリアをリサイズ可能に設定
                self.$el.find('.comment-text').resizeTextarea();

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
                this.commentListCollection = new CommentListCollection();

                //コメントのviewを作成
                new CommentListView( {
                    el: this.$el.find('.comment-list'),
                    collection: this.commentListCollection
                });

                this.model.on('change:new_comment', this.renderComment, this);
            },

            //コメントフォームサブミット時処理
            onSubmitComment: function(e) {
                var form = $(e.target);

                e.preventDefault();

                this.model.set('new_comment', form.find('.comment-text').val());
                form.find('.comment-text').val('');
            },

            //コメント時処理
            renderComment: function(model) {
                var commentModel = new CommentModel( {
                        id: idCreator.getId(),
                        text: model.get('new_comment'),
                        created_time: Math.floor(new Date().getTime() / 1000) + ''
                    });

                //コメントmodelをリストに追加
                this.commentListCollection.add(commentModel);

                //並び替え
                this.root.layout();

            }
        });

        //コメントmodel
        CommentModel = Backbone.Model.extend( {

            //デフォルトの値を設定
            defaults: {
                from: {
                    full_name: 'thujikun',
                    profile_picture: 'https://si0.twimg.com/profile_images/2034815070/DSC_0014.jpg'
                }
            }
        });

        //コメントmodelのリスト
        CommentListCollection = Backbone.Collection.extend( {
            model: CommentModel
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

        new InstagramListView({
            collection: new InstagramCollection()
        });
    });
}.call(window, jQuery);