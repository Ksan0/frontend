define([
    'backbone'
], function(
    Backbone
) {
    var Model = Backbone.Model.extend({

        initialize: function(options) {
            this.game = options.game;
            this.set("game_over", false);
            this.set("default_x", this.get("x"));
            this.set("default_y", this.get("y"));
            this.set("default_radius", this.get("radius"));
            this.set("default_velocity", this.get("velocity"));
            this.set("default_angle", this.get("angle"));
        },

        move: function(paddingMoveLeft, paddingMoveRight) {
            var px = this.get('x');
            var py = this.get('y');
            var radius = this.get('radius') * 0.4;
            var pvelocity = this.get('velocity');
            var pangle = this.get('angle');
            var game = this.get('game');

            var gameWidth = game.get('width');
            var gameHeight = game.get('height');
            var gameLeftOffset = game.get('leftOffset');
            var gameRightOffset = game.get('rightOffset');
            var gameTopOffset = game.get('topOffset');
            var gameBottomOffset = game.get('bottomOffset');
            var nx = px + pvelocity * Math.cos(pangle);
            var ny = py + pvelocity * Math.sin(pangle);

            var padding = this.get('padding');
            var paddingX = padding.get('x');
            var paddingWidth = padding.get('width');
            var nangle = pangle;

            var blocks = this.get('blocks');
            if (nx - radius < -gameWidth / 2 + gameLeftOffset) {
                nangle = -pangle + Math.PI;
                nx = px + pvelocity * Math.cos(nangle);
                ny = py + pvelocity * Math.sin(nangle);
                this.game.addScore(1);
            }
            if (nx + radius > gameWidth / 2 - gameRightOffset) {
                nangle = -pangle + Math.PI;
                nx = px + pvelocity * Math.cos(nangle);
                ny = py + pvelocity * Math.sin(nangle);
                this.game.addScore(1);
            }
            if (ny - 2*radius > gameHeight - gameTopOffset - gameBottomOffset) {
                nangle = -pangle;
                nx = px + pvelocity * Math.cos(nangle);
                ny = py + pvelocity * Math.sin(nangle);
                ny -= 3*radius;
            }
            if (py - radius > 0 && ny - radius < 0 && nx > paddingX - paddingWidth && nx < paddingX + paddingWidth) {
                nangle = -pangle;
                var addAngle = Math.PI * 0.2 * Math.random();
                if (paddingMoveLeft)
                    nangle += addAngle;
                if (paddingMoveRight)
                    nangle -= addAngle;

                nx = px + pvelocity * Math.cos(nangle);
                ny = py + pvelocity * Math.sin(nangle);
                this.game.addScore(2);
            }
            for (var x = blocks.get("leftBorder"); x < blocks.get("rightBorder"); x += blocks.get("dist")) {
                var blx = blocks.get("block_" + x.toString() + "_x");
                var bltype = blocks.get("block_" + x.toString() + "_type");
                var blwidth = blocks.get("width");

                if (ny + radius > gameHeight - gameTopOffset - gameBottomOffset && nx > x - blwidth / 2 && nx < x + blwidth / 2) {
                    nangle = -pangle;
                    nx = px + pvelocity * Math.cos(nangle);
                    ny = py + pvelocity * Math.sin(nangle);
                    this.game.addScore(blocks.get("type_" + bltype.toString() + "_score"));
                    bltype += 1;
                    if (bltype > blocks.get("type_count"))
                        bltype = 1;
                    blocks.set("block_" + x.toString() + "_type", bltype);
                }
            }
            if (ny + radius < 0) {
                this.set("game_over", true);
            }
            this.set('prevx', px);
            this.set('prevy', py);
            this.set('x', nx);
            this.set('y', ny);
            this.set('angle', nangle);

            var scoreDiv = this.get("scoreDiv");
            scoreDiv.innerHTML = this.game.getScore().toString();
        },
        restart: function() {
            this.set("prevx", this.get("x"));
            this.set("prevy", this.get("y"));

            this.set("x", this.get('default_x'));
            this.set("y", this.get('default_y'));
            this.set("radius", this.get('default_radius'));
            this.set("velocity", this.get('default_velocity'));
            this.set("angle", this.get('default_angle'));

            var scoreDiv = this.get("scoreDiv");
            scoreDiv.innerHTML = "0";
        }
    });
    return Model;
});