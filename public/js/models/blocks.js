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
        initialize: function(options) {
            this.game = options.game;

            var gameWidth = this.game.get('width');
            var gameHeight = this.game.get('height');
            var gameLeftOffset = this.game.get('leftOffset');
            var gameRightOffset = this.game.get('rightOffset');
            var gameTopOffset = this.game.get('topOffset');
            var gameBottomOffset = this.game.get('bottomOffset');

            this.set("width", 62);
            this.set("height", 20);
            
            var delta_x = 67;
            var min_x = -gameWidth / 2 + gameLeftOffset + 1.25*this.get('width');
            var max_x = gameWidth / 2 - gameRightOffset - this.get('width')/2;
            
            var delta_y = 23;
            var max_y = gameHeight - gameTopOffset - 6*gameBottomOffset;
            var min_y   = gameHeight - gameTopOffset - 12*gameBottomOffset;

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
                    counter += 1;
                }
            }
            this.set('count', counter);
        },
        recovery: function() {
            var for_data = this.for_data();
            for (var i = 0; i < for_data.count; i += 1) {
                var timer = this.get("block_" + i.toString() + "_timer");
                var deltaT = this.get("game").get("deltaFrapTime");
                if (timer > 0) {
                    timer -= deltaT;
                    this.set("block_" + i.toString() + "_timer", timer);
                    if (timer < 0) {
                        this.set("block_" + i.toString() + "_type", this._randType());
                        this.set("block_" + i.toString() + "_hp", this._randHp());
                    }
                }
            }
        },
        restart: function() {
            var for_data = this.for_data();
            for (var i = 0; i < for_data.count; i += 1) {
                this.set("block_" + i.toString() + "_type", this._randType());
                var hp = this._randHp();
                this.set("block_" + i.toString() + "_hp", hp);
                this.set("block_" + i.toString() + "_bonus", this._randBonus(hp));
                this.set("block_" + i.toString() + "_timer", 0);
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