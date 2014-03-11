define([
    'backbone'
], function(
    Backbone
){
    var View = Backbone.View.extend({
        defaults: {
            context: null,
            game: null,
        },
        initialize: function (options) {
            this.model.on("change:position", this.render, this);
            this.context = options.context;
            this.render();
        },
        render: function () {
            var width = this.model.get("width");
            var height = this.model.get("height");
            var position = this.model.get("position");
            var prevPosition = this.model.get("prevPosition");

            this.context.clearRect(prevPosition-width/2-1, -height-1, width+2, height + 2);
            this.context.fillRect(position-width/2, -height, width, height);
            this.model.set("prevPosition", position);
        },
        show: function () {

        },
        hide: function () {
        }
    });
    return View;
});