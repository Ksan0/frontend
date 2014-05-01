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
        _collision: function(rect, ball) {
            // rect = {x: X, y: Y, w: W, h: H}
            // ball = {x: X, y: Y, r: R}
            // return {vector_x: X, vector_y: Y}
            var collision_count = 0;
            var vector_x = 0;
            var vector_y = 0;
            var dangle = Math.PI / 10;
            for (var angle = 0; angle < 2*Math.PI; angle += dangle) {
                var px = ball.x + ball.r * Math.cos(angle);
                var py = ball.y + ball.r * Math.sin(angle);
        
                if (px < rect.x || px > rect.x + rect.w || py < rect.y || py > rect.y + rect.h)
                    continue;

                ++collision_count;
                vector_x += ball.x - px;
                vector_y += ball.y - py;
            }

            var return_vector_x = 0;
            var return_vector_y = 0;
            if (collision_count !== 0) {
                return_vector_x = vector_x / collision_count;
                return_vector_y = vector_y / collision_count;
            }
            return {vector_x: return_vector_x, vector_y: return_vector_y};
        },
        move: function(paddingMoveLeft, paddingMoveRight) {
            var game = this.get('game');
            var gameWidth = game.get('width');
            var gameHeight = game.get('height');
            var gameLeftOffset = game.get('leftOffset');
            var gameRightOffset = game.get('rightOffset');
            var gameTopOffset = game.get('topOffset');
            var gameBottomOffset = game.get('bottomOffset');
            var deltaFrapTime = game.get('deltaFrapTime');

            var __ball_speed = this.get('velocity');
            var __ball_angle = this.get('angle');
            var ball_speed_x = __ball_speed * Math.cos(__ball_angle) * deltaFrapTime;
            var ball_speed_y = __ball_speed * Math.sin(__ball_angle) * deltaFrapTime;

            var ball_x = this.get('x') + ball_speed_x;
            var ball_y = this.get('y') + ball_speed_y;
            var ball_r = this.get('radius');

            this.set('prevx', ball_x);
            this.set('prevy', ball_y);

            // check borders
            if (ball_x - ball_r < -gameWidth / 2 + gameLeftOffset) {  // left border
                ball_speed_x *= -1;
            }
            if (ball_x + ball_r > gameWidth / 2 - gameRightOffset) {  // right border
                ball_speed_x *= -1;
            }
            if (ball_y + ball_r > gameHeight - gameTopOffset - gameBottomOffset) {  // top border
                ball_speed_y *= -1;
            }

            var padding = this.get('padding');
            var padding_x = padding.get('x');
            var padding_y = padding.get('y');
            var padding_w = padding.get('width');
            var padding_h = padding.get('height');

            var __padding_collision_x = padding_x - padding_w / 2;
            var __padding_collision_y = padding_y - padding_h / 2;
            var result = this._collision(
                {   // rect
                    x: __padding_collision_x,
                    y: __padding_collision_y,
                    w: padding_w,
                    h: padding_h
                }, {    // ball
                    x: ball_x,
                    y: ball_y,
                    r: ball_r
                }
            );
            ball_speed_x += result.vector_x;
            ball_speed_y += result.vector_y;

            this.set('x', ball_x);
            this.set('y', ball_y);
            this.set('angle', Math.atan2(ball_speed_y, ball_speed_x));
            this.set('speed', Math.sqrt(ball_speed_x*ball_speed_x + ball_speed_y*ball_speed_y));
            return;

            /*var px = this.get('x');
            var py = this.get('y');
            var radius = this.get('radius') * 0.4;
            var pvelocity = this.get('velocity');
            var pangle = this.get('angle');
            var game = this.get('game');*/

            /*var nx = px + pvelocity * Math.cos(pangle);
            var ny = py + pvelocity * Math.sin(pangle);*/

            var blocks = this.get('blocks');
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