define([
    'backbone'
], function(
    Backbone
){

    var Model = Backbone.Model.extend({
        defaults: {
            position: 0,
            prevPosition: 0,
            width: 4,
            height: 1,

            game: null
        },
        initialize: function (options) {
            this.game = options.game;
        }
    });
    return Model;
});