define([
    'backbone'
], function(
    Backbone
) {
    var View = Backbone.View.extend({
        initialize: function(options) {
            for (var x = this.model.get("leftBorder"); x < this.model.get("rightBorder"); x += this.model.get("dist")) {
                this.model.on("change:block_" + x.toString() + "_type", this.render, this);
            }
            this.context = options.context;
            this.render();
        },
        render: function() {
            var width = this.model.get("width");
            var height = this.model.get("height");
            for (var x = this.model.get("leftBorder"); x < this.model.get("rightBorder"); x += this.model.get("dist")) {
                var y = this.model.get("block_" + x.toString() + "_y");
                var bltype = this.model.get("block_" + x.toString() + "_type");
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