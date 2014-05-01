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
            this.set("default_x", this.get("x"));
            this.set("default_y", this.get("y"));
            this.set("default_speed_x", this.get("speed_x"));
            this.set("default_speed_y", this.get("speed_y"));
            this.set("default_max_y", this.get("max_y"));
            this.set("default_width", this.get("width"));
            this.set("default_height", this.get("height"));

            this.set("prevx", this.get("x"));
            this.set("prevy", this.get("y"));
        },
        _moveDxDy: function(dx, dy) {    // dX = -1 | 0 | 1 <=> left | nothing | right
            var game = this.get('game');
            var gameWidth = game.get('width');
            var gameHeight = game.get('height');
            var gameLeftOffset = game.get('leftOffset');
            var gameRightOffset = game.get('rightOffset');
            var gameBottomOffset = game.get('bottomOffset');
            var max_y = this.get('max_y');
            var deltaFrapTime = game.get('deltaFrapTime');

            var x = this.get('x');
            var y = this.get('y');
            var width = this.get('width');
            var height = this.get('height');
            var speed_x = this.get('speed_x');
            var speed_y = this.get('speed_y');
            var max_speed_x = this.get('max_speed_x');
            var max_speed_y = this.get('max_speed_y');
            var acceleration_x = this.get('acceleration_x') * dx * deltaFrapTime;
            var acceleration_y = this.get('acceleration_y') * dy * deltaFrapTime;
            var friction_x = speed_x === 0 ? 0 : this.get('friction_x') * deltaFrapTime * speed_x / Math.abs(speed_x);
            var friction_y = speed_y === 0 ? 0 : this.get('friction_y') * deltaFrapTime * speed_y / Math.abs(speed_y);
            this.set('prevx', x);
            this.set('prevy', y);

            speed_x += -friction_x + acceleration_x;
            if (Math.abs(speed_x) > max_speed_x)
                speed_x *= max_speed_x / Math.abs(speed_x);

            speed_y += -friction_y + acceleration_y;
            if (Math.abs(speed_y) > max_speed_y)
                speed_y *= max_speed_y / Math.abs(speed_y);
 
            if (speed_x < 0) {
                if(x + speed_x * deltaFrapTime - width / 2 > -gameWidth / 2 + gameLeftOffset) {
                    x += speed_x * deltaFrapTime;
                } else {
                    x = -gameWidth / 2 + gameLeftOffset + width / 2;
                    speed_x = 0;
                }
            } else if (speed_x > 0) {
                if (x + speed_x * deltaFrapTime + width / 2 < gameWidth / 2 - gameRightOffset) {
                    x += speed_x * deltaFrapTime;
                } else {
                    x = gameWidth / 2 - gameRightOffset - width / 2;
                    speed_x = 0;
                }
            }
            
            if (speed_y < 0) {
                if(y + speed_y * deltaFrapTime - height / 2 > gameBottomOffset) {
                    y += speed_y * deltaFrapTime;
                } else {
                    y = gameBottomOffset + height / 2;
                    speed_y = 0;
                }
            } else if (speed_y > 0) {
                if (y + speed_y * deltaFrapTime + height / 2 < max_y + gameBottomOffset) {
                    y += speed_y * deltaFrapTime;
                } else {
                    y = max_y + gameBottomOffset - height / 2;
                    speed_y = 0;
                }
            }

            this.set('x', x);
            this.set('y', y);
            this.set('speed_x', speed_x);
            this.set('speed_y', speed_y);
        },
        move: function(leftKey, rightKey, upKey, downKey) {
            var dx = leftKey == rightKey ? 0 : -Number(leftKey) + Number(rightKey);
            var dy = upKey == downKey ? 0 : -Number(downKey) + Number(upKey);
            this._moveDxDy(dx, dy);
        },
        restart: function() {
            this.set("prevx", this.get("x"));
            this.set("prevy", this.get("y"));

            this.set("x", this.get("default_x"));
            this.set("y", this.get("default_y"));
            this.set("speed_x", this.get("default_speed_x"));
            this.set("speed_y", this.get("default_speed_y"));
            this.set("max_y", this.get("default_max_y"));
            this.set("width", this.get("default_width"));
            this.set("height", this.get("default_height"));
        }
    });
    return Model;
});