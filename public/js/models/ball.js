define([
    'backbone'
], function(
    Backbone
){
    var Model = Backbone.Model.extend({
        defaults: {
            x: 1,
            y: 2,
            prevx: 0,
            prevy: 20,
            velocity: 0,
            angle: 0,
            radius: 10,

            game: null
        },
        initialize: function (options) {
            this.game = options.game;
        },

        step: function () {
            var px = this.get('x');
            var py = this.get('y');
            var pvelocity = this.get('velocity');
            var pangle = this.get('angle');
            var game = this.get('game');

            var gameWidth = game.get('width');
            var gameHeight = game.get('height');
            var gameLeftOffset = game.get('leftOffset');
            var gameRightOffset = game.get('rightOffset');
            var gameTopOffset = game.get('topOffset');
            var gameBottomOffset = game.get('bottomOffset');
            var nx = px + pvelocity*Math.cos(pangle);
            var ny = py + pvelocity*Math.sin(pangle);
            var nangle = pangle;
            if (nx < - gameWidth/2 + gameLeftOffset) {
                nangle = -pangle + Math.PI;
                nx = px + pvelocity*Math.cos(nangle);
                ny = py + pvelocity*Math.sin(nangle);
            }
            if (nx > gameWidth/2 - gameRightOffset) {
                nangle = -pangle + Math.PI;
                nx = px + pvelocity*Math.cos(nangle);
                ny = py + pvelocity*Math.sin(nangle);
            }
            if (ny > gameHeight - gameTopOffset - gameBottomOffset) {
                nangle = -pangle;
                nx = px + pvelocity*Math.cos(nangle);
                ny = py + pvelocity*Math.sin(nangle);
            }
            if (ny < 0) {
                console.log('lives');
            }
            this.set('x', nx);
            this.set('y', ny);
            this.set('angle', nangle);
        }
    });
    return Model;
});