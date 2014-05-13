define([
    'backbone'
], function(
    Backbone
) {
    var View = Backbone.View.extend({
        initialize: function(options) {
            var types_count = this.model.get('types_count');
            var hp_max = this.model.get('hp_max');

            var dict = {};
            for (var t = 1; t <= types_count; t += 1) {
                for (var hp = 1; hp <= hp_max; hp += 1) {
                    var img = new Image();
                    img.src = '/css/images/block_' + t.toString() + '_' + hp.toString() + '.png';
                    dict['block_img_' + t.toString() + '_' + hp.toString()] = img;
                }
            }
            for (var t = 2; t <= types_count; t += 1) {
                var img = new Image();
                img.src = '/css/images/bonus_' + t.toString() + '.png';
                dict['bonus_img_' + t.toString()] = img;
            }
            this.imgs = dict;

            var for_data = this.model.for_data();
            /*for (var i = 0; i < for_data.count; i += 1) {
                this.model.on("change:block_" + i.toString() + "_hp", this.render, this);
            }*/

            this.context = options.context;
            this.context_bonus = options.context_bonus;
        },
        render: function() {
            var width = this.model.get("width");
            var height = this.model.get("height");
            var for_data = this.model.for_data();
            
            for (var i = 0; i < for_data.count; i += 1) {
                var x = this.model.get("block_" + i.toString() + "_x");
                var y = this.model.get("block_" + i.toString() + "_y");
                var t = this.model.get("block_" + i.toString() + "_type");
                var hp = this.model.get("block_" + i.toString() + "_hp");
          
                this.context.clearRect(x-width/2, y-height/2, width, height);
                if (hp > 0) {
                    var img = this.imgs["block_img_" + t.toString() + "_" + hp.toString()];
                    this.context.drawImage(img, x-width/2, y-height/2, width, height);
                }
            }

            var bonus_width = this.model.get('bonus_width');
            var bonus_height = this.model.get('bonus_height');
            for (var i = 0; i < for_data.count; i += 1) {
                var x = this.model.get("bonus_" + i.toString() + "_x");
                var y = this.model.get("bonus_" + i.toString() + "_y");
                var prevx = this.model.get("bonus_" + i.toString() + "_lastDrawX");
                var prevy = this.model.get("bonus_" + i.toString() + "_lastDrawY");

                if (! this.model.get("bonus_" + i.toString() + "_enabled")) {
                    if (this.model.get("bonus_" + i.toString() + "_needClear")) {
                        this.context_bonus.clearRect(prevx-0.6*bonus_width, prevy-0.6*bonus_height, 1.2*bonus_width, 1.2*bonus_height);
                        this.context_bonus.clearRect(x-0.6*bonus_width, y-0.6*bonus_height, 1.2*bonus_width, 1.2*bonus_height);
                        this.model.set("bonus_" + i.toString() + "_needClear", false);
                    }
                    continue;
                }

                var t = this.model.get("bonus_" + i.toString() + "_type");

                this.context_bonus.clearRect(prevx-0.6*bonus_width, prevy-0.6*bonus_height, 1.2*bonus_width, 1.2*bonus_height);
                
                var img = this.imgs["bonus_img_" + t.toString()];
                this.context_bonus.drawImage(img, x-bonus_width/2, y-bonus_height/2, bonus_width, bonus_height);
                this.model.set('bonus_' + i.toString() + '_lastDrawX', x);
                this.model.set('bonus_' + i.toString() + '_lastDrawY', y);
            }
        },
        clearAll: function() {
            var width = this.model.get("width");
            var height = this.model.get("height");
            var for_data = this.model.for_data();
            
            for (var i = 0; i < for_data.count; i += 1) {
                var x = this.model.get("block_" + i.toString() + "_x");
                var y = this.model.get("block_" + i.toString() + "_y");
                this.context.clearRect(x-width/2, y-height/2, width, height);
            }

            var bonus_width = this.model.get('bonus_width');
            var bonus_height = this.model.get('bonus_height');
            for (var i = 0; i < for_data.count; i += 1) {
                var x = this.model.get("bonus_" + i.toString() + "_x");
                var y = this.model.get("bonus_" + i.toString() + "_y");
                this.context_bonus.clearRect(x-0.8*bonus_width, y-0.8*bonus_height, 1.6*bonus_width, 1.6*bonus_height);
            }
        },
        show: function() {

        },
        hide: function() {}
    });
    return View;
});