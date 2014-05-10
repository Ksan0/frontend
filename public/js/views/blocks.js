define([
    'backbone'
], function(
    Backbone
) {
    var View = Backbone.View.extend({
        initialize: function(options) {
            var for_data = this.model.for_data();
            for (var i = 0; i < for_data.count; i += 1) {
                this.model.on("change:block_" + i.toString() + "_type", this.render, this);
            }
            this.context = options.context;
            this.render();
        },
        render: function() {
            var width = this.model.get("width");
            var height = this.model.get("height");
            var for_data = this.model.for_data();
            for (var i = 0; i < for_data.count; i += 1) {
                var x = this.model.get("block_" + i.toString() + "_x");
                var y = this.model.get("block_" + i.toString() + "_y");
                var bltype = this.model.get("block_" + i.toString() + "_type");
                this.context.fillStyle = this.model.get("type_" + bltype.toString() + "_color");
                this.context.fillRect(x - width / 2, y, width, height);
            }
        },
        show: function() {

        },
        hide: function() {}
    });
    return View;
});