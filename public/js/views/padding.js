define([
    'backbone'
], function(
    Backbone
) {
    var View = Backbone.View.extend({
        initialize: function(options) {
            this.model.on("change:x", this.render, this);
            this.context = options.context;
            this.render();
        },
        render: function() {
            var width = this.model.get("width");
            var height = this.model.get("height");
            var x = this.model.get("x");
            var prevx = this.model.get("prevx");
            this.context.clearRect(prevx - width / 2, -height, width, height);
            this.context.fillStyle = 'green';
            this.context.fillRect(x - width / 2, -height, width, height);
        },
        show: function() {
        },
        hide: function() {
        }
    });
    return View;
});