define([
    'backbone'
], function(
    Backbone
) {
    var View = Backbone.View.extend({
        initialize: function(options) {
            //this.model.on("change:x change:y", this.render, this);
            this.context = options.context;
            this.render();
        },
        render: function() {
            var width = this.model.get("width");
            var height = this.model.get("height");
            var x = this.model.get("x");
            var y = this.model.get("y");
            var prevx = this.model.get("prevx");
            var prevy = this.model.get("prevy");
            this.context.clearRect(prevx - width, prevy - height, 2*width, 2*height);
            this.context.fillStyle = 'green';
            this.context.fillRect(x - width/2, y - height/2, width, height);
        },
        show: function() {

        },
        hide: function() {}
    });
    return View;
});