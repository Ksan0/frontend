define([
    'backbone'
], function(
    Backbone
) {

    var Model = Backbone.Model.extend({
        defaults: {
        },
        initialize: function(options) {
            this.game = options.game;

            var gameWidth = this.game.get('width');
            var gameHeight = this.game.get('height');
            var gameLeftOffset = this.game.get('leftOffset');
            var gameRightOffset = this.game.get('rightOffset');
            var gameTopOffset = this.game.get('topOffset');
            var gameBottomOffset = this.game.get('bottomOffset');

            this.set("width", 62);
            this.set("height", 20);
            var dist = 67;
            var leftBorder = -gameWidth / 2 + gameLeftOffset + this.get('width');
            var rightBorder = gameWidth / 2 - gameRightOffset - this.get('width')/2;

            var y_from = gameHeight - gameTopOffset - 4*gameBottomOffset;
            var y_to   = gameHeight - gameTopOffset - 8*gameBottomOffset;
            var for_data = this.for_data();
            var counter = 0;
            for (var x = leftBorder; x < rightBorder; x += dist) {
                this.set("block_" + counter.toString() + "_x", x);
                this.set("block_" + counter.toString() + "_y", y_from);
                this.set("block_" + counter.toString() + "_type", 1);
                counter += 1;
            }
            this.set('count', counter);

            this.set("type_1_color", "lightblue");
            this.set("type_2_color", "blue");
            this.set("type_3_color", "#FF00FF");
            this.set("type_4_color", "pink");
            this.set("type_5_color", "red");

            this.set("type_1_score", 1);
            this.set("type_2_score", 2);
            this.set("type_3_score", 3);
            this.set("type_4_score", 5);
            this.set("type_5_score", 10);

            this.set("type_count", 5);
        },
        restart: function() {
            var for_data = this.for_data();
            for (var i = 0; i < for_data.count; i += 1) {
                this.set("block_" + i.toString() + "_type", 1);
            }
        },
        for_data: function() {
            return {
                'count': this.get('count')
            };
        }
    });
    return Model;
});