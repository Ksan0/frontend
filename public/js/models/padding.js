define([
    'backbone'
], function(
    Backbone
) {

    var Model = Backbone.Model.extend({
        defaults: {
            x: 0,
            delta: 5
        },
        initialize: function(options) {
            this.game = options.game;
            this.set("default_x", this.get("x"));
            this.set("default_delta", this.get("delta"));
            this.set("default_width", this.get("width"));
        },
        moveRight: function() {
            var x = this.get('x');
            var delta = this.get('delta');
            var gameWidth = this.game.get('width');
            var paddingWidth = this.get('width');
            var rightOffset = this.game.get('rightOffset');
            if (x + delta + paddingWidth / 2 < gameWidth / 2 - rightOffset) {
                this.set('x', x + delta);
                this.set('prevx', x);
            }
        },
        moveLeft: function() {
            var x = this.get('x');
            var delta = this.get('delta');
            var gameWidth = this.game.get('width');
            var paddingWidth = this.get('width');
            var leftOffset = this.game.get('leftOffset');
            if (x - delta - paddingWidth / 2 > -gameWidth / 2 + leftOffset)
                this.set('x', x - delta);
            this.set('prevx', x);
        },
        restart: function() {
            this.set("prevx", this.get("x"));

            this.set("x", this.get("default_x"));
            this.set("delta", this.get("default_delta"));
            this.set("width", this.get("default_width"));
        }
    });
    return Model;
});