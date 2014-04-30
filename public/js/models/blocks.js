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

            this.set("leftBorder", -gameWidth / 2 + gameLeftOffset + 20);
            this.set("rightBorder", gameWidth / 2 - gameRightOffset);
            this.set("width", 65);
            this.set("height", 20);
            this.set("dist", 70);

            var y = gameHeight - gameTopOffset - gameBottomOffset;
            for (var x = this.get("leftBorder"); x < this.get("rightBorder"); x += this.get("dist")) {
                this.set("block_" + x.toString() + "_x", x);
                this.set("block_" + x.toString() + "_y", y);
                this.set("block_" + x.toString() + "_type", 1);
            }

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
            for (var x = this.get("leftBorder"); x < this.get("rightBorder"); x += this.get("dist")) {
                this.set("block_" + x.toString() + "_x", x);
                this.set("block_" + x.toString() + "_type", 1);
            }
        }
    });
    return Model;
});