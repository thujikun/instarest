define([
    'backbone'
], function(Backbone) {
    var InstagramModel,
        InstagramCollection,
        CommentModel,
        CommentListCollection;

    //Instagramの写真ごとのmodel
    InstagramModel = Backbone.Model.extend();

    //Instagramの写真ごとのmodelの配列
    InstagramCollection = Backbone.Collection.extend( {

        url: 'https://api.instagram.com/v1/media/popular?count=20&access_token=144784204.1cf1905.1da25a7e3bf548a38642c7542d2e03bb',

        model: InstagramModel,

        parse: function(response) {
            return response.data;
        }
    });

    //コメントmodel
    CommentModel = Backbone.Model.extend( {

        //デフォルトの値を設定
        defaults: {
            from: {
                full_name: 'Mickey',
                profile_picture: 'http://img2.blogs.yahoo.co.jp/ybi/1/cd/b8/riocimarron/folder/224110/img_224110_8995454_0?1257512276'
            }
        }
    });

    //コメントmodelのリスト
    CommentListCollection = Backbone.Collection.extend( {
        model: CommentModel
    });

    return {
        InstagramCollection: InstagramCollection,
        InstagramModel: InstagramModel,
        CommentListCollection: CommentListCollection,
        CommentModel: CommentModel
    };

});