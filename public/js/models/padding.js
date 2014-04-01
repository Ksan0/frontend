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
        }
    });
    return Model;
});