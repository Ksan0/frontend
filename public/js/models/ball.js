define([
    'backbone'
], function(
    Backbone
){
    var Model = Backbone.Model.extend({
        defaults: {
            xx: 0,
            yy: 20,
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
            var px = this.xx;
            var py = this.yy;
            var pangle = this.angle;
            var nx = px + this.velocity*Math.cos(this.angle);
            var ny = py + this.velocity*Math.cos(this.angle);
            var nangle;

            if (nx < - this.game.width/2 + this.game.leftOffset) {
                nangle = -pangle + Math.PI;
                nx = px + this.velocity*Math.cos(nangle);
                ny = py + this.velocity*Math.sin(nangle);
            }
            if (nx > this.game.width/2 - this.game.rightOffset) {
                nangle = -pangle + Math.PI;
                nx = px + this.velocity*Math.cos(nangle);
                ny = py + this.velocity*Math.sin(nangle);
            }
            if (ny > this.game.height - this.game.topOffset) {
                nangle = -pangle;
                nx = px + this.velocity*Math.cos(nangle);
                ny = py + this.velocity*Math.sin(nangle);
            }
            if (ny < 0) {
                alert("lives");
            }
            this.xx = nx;
            this.yy = ny;
            this.angle = pangle;
        }
    });
    return Model;
});