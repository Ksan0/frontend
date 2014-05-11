define([
    'backbone'
], function(
    Backbone
) {
    var Model = Backbone.Model.extend({

        initialize: function(options) {
            this.game = options.game;
            this.set("game_over", false);
            this.set("life", 1);
            this.set("default_x", this.get("x"));
            this.set("default_y", this.get("y"));
            this.set("default_radius", this.get("radius"));
            this.set("default_velocity", this.get("velocity"));
            this.set("default_angle", this.get("angle"));
            this.set("bonus", "none");

            this.set('prevx', this.get('x'));
            this.set('prevy', this.get('y'));
        },
        _collision: function(rect, ball) {
            // rect = {x: Number, y: Number, w: Number, h: Number, speed_x: Number}
            // ball = {x: Number, y: Number, r: Number, rot: Number}
            // return {is: Boolean, vector_x: Number, vector_y: Number, vector_rot: Number}
            var collision_count = 0;
            var vector_x = 0;
            //var vector_x_fromPadding = 0;
            var vector_y = 0;
            var vector_rot = 0;
            var dangle = Math.PI / 10;
            for (var angle = 0; angle < 2*Math.PI; angle += dangle) {
                var px = ball.x + ball.r * Math.cos(angle);
                var py = ball.y + ball.r * Math.sin(angle);
        
                if (px < rect.x || px > rect.x + rect.w || py < rect.y || py > rect.y + rect.h)
                    continue;

                ++collision_count;

                // speed vectors
                vector_x += ball.x - px;
                vector_x += rect.speed_x * 0.1;
                vector_y += ball.y - py;

                // rotation vector
                //vector_rot += ball.rot_inc;
            }

            var return_vector_x = 0;
            var return_vector_y = 0;
            var return_vector_rot = 0;
            if (collision_count !== 0) {
                return_vector_x = vector_x / collision_count;
                return_vector_y = vector_y / collision_count;
                return_vector_rot = vector_rot / collision_count;
            }

            var is = collision_count === 0 ? false : true;
            return {
                is: is,
                vector_x: return_vector_x,
                vector_y: return_vector_y,
                vector_rot: return_vector_rot
            };
        },
        move: function() {
            var deltaT = this.get('game').get('deltaFrapTime');
            var ball_speed = this.get('velocity') * deltaT;
            var step = 30;

            var good = false;
            if (ball_speed >= step) {
                for (var i = 1; i <= ball_speed / step + 0.5; i += 1) {
                    this._move(step);
                    good = true;
                }
            } else {
                this._move(ball_speed);
            }

            var bonus_time = this.get('bonus_time') - deltaT;
            this.set('bonus_time', bonus_time);
            if (bonus_time <= 0)
                this.setBonus(0);
            var bonus = this.get("bonus");
            if (bonus != "none") {
                this.get("bonusDiv").innerHTML = bonus + "(" + Math.floor(bonus_time).toString() + "s)";
            } else {
                this.get("bonusDiv").innerHTML = "";
            }
        },
        _move: function(__ball_speed) {
            var game = this.get('game');
            var gameWidth = game.get('width');
            var gameHeight = game.get('height');
            var gameLeftOffset = game.get('leftOffset');
            var gameRightOffset = game.get('rightOffset');
            var gameTopOffset = game.get('topOffset');
            var gameBottomOffset = game.get('bottomOffset');
            var deltaFrapTime = game.get('deltaFrapTime');

            var __ball_angle = this.get('angle');
            var ball_speed_x = __ball_speed * Math.cos(__ball_angle);
            var ball_speed_y = __ball_speed * Math.sin(__ball_angle);
            var ball_rotation = this.get('rotation');
            var ball_rotation_inc = this.get('rotation_inc');

            var ball_x = this.get('x') + ball_speed_x;
            var ball_y = this.get('y') + ball_speed_y;
            var ball_r = this.get('radius');

            this.set('prevx', ball_x);
            this.set('prevy', ball_y);

            // check borders
            if (ball_x - ball_r < -gameWidth / 2 + gameLeftOffset) {  // left border
                ball_speed_x *= -1;
                ball_x = this.get('prevx') + ball_speed_x;
                ball_y = this.get('prevy');
            }
            if (ball_x + ball_r > gameWidth / 2 - gameRightOffset) {  // right border
                ball_speed_x *= -1;
                ball_x = this.get('prevx') + ball_speed_x;
                ball_y = this.get('prevy');
            }
            if (ball_y + ball_r > gameHeight - gameTopOffset - gameBottomOffset) {  // top border
                ball_speed_y *= -1;
                ball_x = this.get('prevx');
                ball_y = this.get('prevy') + ball_speed_y;
            }

            var padding = this.get('padding');
            var padding_x = padding.get('x');
            var padding_y = padding.get('y');
            var padding_w = padding.get('width');
            var padding_h = padding.get('height');
            var padding_speed_x = padding.get('speed_x');
            var padding_speed_y = padding.get('speed_y');

            var __padding_collision_x = padding_x - padding_w / 2;
            var __padding_collision_y = padding_y - padding_h / 2;
            var spX = padding.get('max_speed_x') * (ball_speed_x / __ball_speed);
            var result = this._collision(
                {   // rect
                    x: __padding_collision_x,
                    y: __padding_collision_y,
                    w: padding_w,
                    h: padding_h,
                    speed_x: padding_speed_x + spX
                }, {    // ball
                    x: ball_x,
                    y: ball_y,
                    r: ball_r,
                    rot: ball_rotation,
                    rot_inc: ball_rotation_inc
                }
            );
            ball_speed_x += result.vector_x;
            ball_speed_y += result.vector_y;
            ball_rotation += result.vector_rot;

            padding_speed_x -= 3*result.vector_x;
            padding_speed_y -= 3*result.vector_y;

            var blocks = this.get('blocks');
            var blocks_width = blocks.get('width');
            var blocks_height = blocks.get('height');
            var for_data = blocks.for_data();
            for (var i = 0; i < for_data.count; i += 1) {
                var hp = blocks.get('block_' + i.toString() + '_hp');
                if (hp <= 0)
                    continue;

                spX = padding.get('max_speed_x') * (ball_speed_x / __ball_speed);
                result = this._collision(
                    {   // rect
                        x: blocks.get('block_' + i.toString() + '_x') - blocks_width / 2,
                        y: blocks.get('block_' + i.toString() + '_y') - blocks_height / 2,
                        w: blocks_width,
                        h: blocks_height,
                        speed_x: spX
                    },
                    {   // ball
                        x: ball_x,
                        y: ball_y,
                        r: ball_r,
                        rot: ball_rotation,
                        rot_inc: ball_rotation_inc
                    }
                );

                if (result.is) {
                    ball_speed_x += result.vector_x;
                    ball_speed_y += result.vector_y;
                    if (this.get("bonus") == "strength") 
                        hp = 0;
                    else 
                        hp -= 1;
                    blocks.set('block_' + i.toString() + '_hp', hp);
                    if (hp <= 0) {
                        blocks.ballDestroyBlock(i);
                        game.addScore(20);
                        this.get('scoreDiv').innerHTML = game.getScore();
                    }
                }
            }

            if (ball_y < 0) {
                var life = this.get("life");
                if (life > 0) {
                    this.set("life", life - 1);
                    this.get("lifeDiv").innerHTML = life - 1;
                    ball_speed_y *= -1;
                    ball_y = this.get("prevy") + 2*ball_speed_y;
                } else {
                    this.set("game_over", true);
                }
            }

            this.set('x', ball_x);
            this.set('y', ball_y);
            this.set('angle', Math.atan2(ball_speed_y, ball_speed_x));
            this.set('speed', Math.sqrt(ball_speed_x*ball_speed_x + ball_speed_y*ball_speed_y));
            this.set('rotation', ball_rotation);

            padding.set('speed_x', padding_speed_x);
            padding.set('speed_y', padding_speed_y);
            return;
        },
        setBonus: function(type) {
            if (this.get("bonus") == "velocity" && type != 4) {
                var padding = this.get('padding');
                padding.set('max_speed_x', padding.get('default_max_speed_x'));
                padding.set('max_speed_y', padding.get('default_max_speed_y'));
                padding.set('acceleration_x', padding.get('default_acceleration_x'));
                padding.set('acceleration_y', padding.get('default_acceleration_y'));
                padding.set('friction_x', padding.get('default_friction_x'));
                padding.set('friction_y', padding.get('default_friction_y'));
                this.set('velocity', this.get('velocity')/1.5);
            }

            /*
                max_speed_x: 150,
                max_speed_y: 75,
                acceleration_x: 175,
                acceleration_y: 175,
                friction_x: 50,
                friction_y: 50,
            */

            switch(type) {
                case 2:     // velocity
                    this.set("bonus", "velocity");
                    var padding = this.get('padding');
                    padding.set('max_speed_x', 200);
                    padding.set('max_speed_y', 150);
                    padding.set('acceleration_x', 10000);
                    padding.set('acceleration_y', 10000);
                    padding.set('friction_x', 1000);
                    padding.set('friction_y', 1000);
                    this.set('velocity', this.get('velocity')*1.5);
                    break;
                case 3:     // strength
                    this.set("bonus", "strength");
                    break;
                case 4:     // life
                    this.set('life', this.get('life') + 1);
                    this.get("lifeDiv").innerHTML = this.get('life');
                    break;
                default:
                    this.set("bonus", "none");
            }

            if (this.get("bonus") != "none") {
                this.set("bonus_time", 10);
            }
        },
        restart: function() {
            this.set("prevx", this.get("x"));
            this.set("prevy", this.get("y"));

            this.set("life", 1);
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