define([
    'backbone'
], function(
    Backbone
){
    var Model = Backbone.Model.extend({
        
        initialize: function (options) {
            this.game = options.game;
        },

        move: function () {
            var px = this.get('x');
            var py = this.get('y');
            var radius = this.get('radius');
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

            var padding = this.get('padding')
            var paddingX = padding.get('x');
            var paddingWidth = padding.get('width');
            var nangle = pangle;
            if (nx-radius < - gameWidth/2 + gameLeftOffset) {
                nangle = -pangle + Math.PI;
                nx = px + pvelocity*Math.cos(nangle);
                ny = py + pvelocity*Math.sin(nangle);
            }
            if (nx+radius > gameWidth/2 - gameRightOffset) {
                nangle = -pangle + Math.PI;
                nx = px + pvelocity*Math.cos(nangle);
                ny = py + pvelocity*Math.sin(nangle);
            }
            if (ny+radius > gameHeight - gameTopOffset - gameBottomOffset) {
                nangle = -pangle;
                nx = px + pvelocity*Math.cos(nangle);
                ny = py + pvelocity*Math.sin(nangle);
            }
            if (py - radius > 0 && ny - radius < 0 && nx > paddingX - paddingWidth && nx < paddingX + paddingWidth) {
                nangle = -pangle;
                nx = px + pvelocity*Math.cos(nangle);
                ny = py + pvelocity*Math.sin(nangle);
            }
            if (ny + radius < 0) {
                console.log('lives');
            }
            this.set('prevx', px);
            this.set('prevy', py);
            this.set('x', nx);
            this.set('y', ny);
            this.set('angle', nangle);
        }
    });
    return Model;
});