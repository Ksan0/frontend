define([
    'backbone'
], function(
    Backbone
) {

    var Model = Backbone.Model.extend({
        defaults: {
        },
        _randType: function() {
            var chanceList = new Array(0.55, 0.15, 0.15, 0.15);
            var r = Math.random();

            var chanceNow = 0;
            var counter = 1;
            for (var i = 0; i < this.get('types_count'); i += 1) {
                if (r < chanceList[i] + chanceNow) {
                    return counter;
                }
                counter += 1;
                chanceNow += chanceList[i];
            }

            return this.get('types_count');
        },
        _randHp: function() {
            //return 1;

            var chanceList = new Array(0.05, 0.20, 0.50, 0.25);
            var r = Math.random();

            var chanceNow = 0;
            var counter = 1;
            for (var i = 0; i < this.get('hp_max'); i += 1) {
                if (r < chanceList[i] + chanceNow) {
                    return counter;
                }
                counter += 1;
                chanceNow += chanceList[i];
            }

            return this.get('hp_max');
        },
        _randBonus: function(hp) {
            var r = Math.random();
            return r <  0.1*hp;
        },
        _collisionPadding: function(px, py) {
            var padding = this.get('padding');
            var padding_x = padding.get('x');
            var padding_y = padding.get('y');
            var padding_w = padding.get('width');
            var padding_h = padding.get('height');
            
            return  px > padding_x - padding_w/2 && px < padding_x + padding_w/2 &&
                    py > padding_y - padding_h/2 && py < padding_y + padding_h/2;
        },
        _collision: function(x, y, w, h) {
            var result = this._collisionPadding(x - w/2, y - h/2) ||
                         this._collisionPadding(x - w/2, y + h/2) ||
                         this._collisionPadding(x + w/2, y - h/2) ||
                         this._collisionPadding(x + w/2, y + h/2);
            return result;
        },
        initialize: function(options) {
            this.game = options.game;
            this.padding = options.padding;

            var gameWidth = this.game.get('width');
            var gameHeight = this.game.get('height');
            var gameLeftOffset = this.game.get('leftOffset');
            var gameRightOffset = this.game.get('rightOffset');
            var gameTopOffset = this.game.get('topOffset');
            var gameBottomOffset = this.game.get('bottomOffset');

            this.set("bonus_width", 20);
            this.set("bonus_height", 20);
            this.set("width", 62);
            this.set("height", 20);
            
            var delta_x = 67;
            var min_x = -gameWidth / 2 + gameLeftOffset + 1.25*this.get('width');
            var max_x = gameWidth / 2 - gameRightOffset - this.get('width')/2;
            
            var delta_y = 50;
            var max_y = gameHeight - gameTopOffset - 6*gameBottomOffset;
            var min_y   = gameHeight - gameTopOffset - 18*gameBottomOffset;

            this.set('types_count', 4);
            this.set('hp_max', 3);

            var for_data = this.for_data();
            var counter = 0;
            for (var x = min_x; x < max_x; x += delta_x) {
                for(var y = max_y; y > min_y; y -= delta_y) {
                    this.set("block_" + counter.toString() + "_x", x);
                    this.set("block_" + counter.toString() + "_y", y);
                    this.set("block_" + counter.toString() + "_type", this._randType());
                    var hp = this._randHp();
                    this.set("block_" + counter.toString() + "_hp", hp);
                    this.set("block_" + counter.toString() + "_bonus", this._randBonus(hp));
                    this.set("block_" + counter.toString() + "_timer", 0);

                    this.set("bonus_" + counter.toString() + "_enabled", false);
                    this.set("bonus_" + counter.toString() + "_needClear", false);
                    this.set('bonus_' + counter.toString() + '_lastDrawX', 0);
                    this.set('bonus_' + counter.toString() + '_lastDrawY', 0);
                    counter += 1;
                }
            }
            this.set('count', counter);
        },
        restart: function() {
            var for_data = this.for_data();
            for (var i = 0; i < for_data.count; i += 1) {
                this.set("block_" + i.toString() + "_type", this._randType());
                var hp = this._randHp();
                this.set("block_" + i.toString() + "_hp", hp);
                this.set("block_" + i.toString() + "_bonus", this._randBonus(hp));
                this.set("block_" + i.toString() + "_timer", 0);

                this.set("bonus_" + i.toString() + "_enabled", false);
            }
        },
        ballDestroyBlock: function(index) {
            var game = this.get('game');

            var max_t = 180;
            var min_t = 120;
            var time = Math.random() * (max_t - min_t + 1) + min_t + game.getScore() * 0.1;
            this.set('block_' + index.toString() + '_timer', time);
            var t = this.get('block_' + index.toString() + '_type');

            if (t != 1) {
                var x = this.get('block_' + index.toString() + '_x');
                var y = this.get('block_' + index.toString() + '_y');
                
                this.set('bonus_' + index.toString() + '_enabled', true);
                this.set('bonus_' + index.toString() + '_x', x);
                this.set('bonus_' + index.toString() + '_y', y);
                this.set('bonus_' + index.toString() + '_speed_y', -100);
                this.set('bonus_' + index.toString() + '_type', t);
            }
        },
        step: function() {
            var for_data = this.for_data();
            var deltaT = this.get("game").get("deltaFrapTime");
            // blocks recovery
            for (var i = 0; i < for_data.count; i += 1) {
                var timer = this.get("block_" + i.toString() + "_timer");
                if (timer > 0) {
                    timer -= deltaT;
                    this.set("block_" + i.toString() + "_timer", timer);
                    if (timer < 0) {
                        this.set("block_" + i.toString() + "_type", this._randType());
                        this.set("block_" + i.toString() + "_hp", this._randHp());
                    }
                }
            }

            // bonus move
            var bonus_width = this.get('bonus_width');
            var bonus_height = this.get('bonus_height');
            for (var i = 0; i < for_data.count; i += 1) {
                if (! this.get('bonus_' + i.toString() + '_enabled'))
                    continue;
                var speed_y = this.get('bonus_' + i.toString() + '_speed_y');
                var x = this.get('bonus_' + i.toString() + '_x');
                var y = this.get('bonus_' + i.toString() + '_y') + speed_y * deltaT;
                this.set('bonus_' + i.toString() + '_y', y);

                var collision = this._collision(x, y, bonus_width, bonus_height);
                if (collision) {
                    this.set('bonus_' + i.toString() + '_enabled', false);
                    this.set("bonus_" + i.toString() + "_needClear", true);
                    var t = this.get('bonus_' + i.toString() + '_type');
                    this.get('ball').setBonus(t);
                }

                if (y < 0) {
                    this.set('bonus_' + i.toString() + '_enabled', false);
                    this.set("bonus_" + i.toString() + "_needClear", true);
                }
            }
        },
        for_data: function() {
            return {
                'count': this.get('count')
            };
        },
        isWinGame: function() {
            var for_data = this.for_data();
            for (var i = 0; i < for_data.count; i += 1) {
                if (this.get('block_' + i.toString() + '_hp') > 0)
                    return false;
            }

            return true;
        }
    });
    return Model;
});