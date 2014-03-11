define([
    'backbone'
], function(
    Backbone
){
    var View = Backbone.View.extend({
        defaults: {
            context: null,
            game: null
        },
        initialize: function (options) {
            //this.model.on("change:xx yy", this.render, this);
            this.context = options.context;
            this.render();
        },
        render: function () {
            var radius = this.model.get('radius');
            var x = this.model.get('x');
            var y = this.model.get('y');
            var prevx = this.model.get('prevx');
            var prevy = this.model.get('prevy');
            this.context.beginPath();
            this.context.arc(x, y, radius, 0, 2*Math.PI, false);
            this.context.fillStyle = 'red';
            this.context.fill();
        },
        show: function () {

        },
        hide: function () {
        }
    });
    return View;
});