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
                    dict['img_' + t.toString() + '_' + hp.toString()] = img;
                }
            }
            this.imgs = dict;

            var for_data = this.model.for_data();
            for (var i = 0; i < for_data.count; i += 1) {
                this.model.on("change:block_" + i.toString() + "_type", this.render, this);
            }
            this.context = options.context;
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
                    var img = this.imgs["img_" + t.toString() + "_" + hp.toString()];
                    this.context.drawImage(img, x-width/2, y-height/2, width, height);
                }
            }
        },
        show: function() {

        },
        hide: function() {}
    });
    return View;
});