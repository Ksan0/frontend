define([
    'backbone'
], function(
    Backbone
){
    var View = Backbone.View.extend({
        initialize: function (options) {
            this.model.on("change:x change:y", this.render, this);
            this.context = options.context;
            this.render();
        },
        render: function () {
            var radius = this.model.get('radius');
            var x = this.model.get('x');
            var y = this.model.get('y');
            var prevx = this.model.get('prevx');
            var prevy = this.model.get('prevy');
            this.context.clearRect(prevx - radius, prevy - radius, 2*radius, 2*radius);
            this.context.beginPath();
            this.context.arc(x, y, radius, 0, 2*Math.PI, true);
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