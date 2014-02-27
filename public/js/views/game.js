define([
    'backbone',
    'tmpl/game'
], function(
    Backbone,
    tmpl
){

    var View = Backbone.View.extend({
        template: tmpl,
        initialize: function () {
            
        },
        render: function () {
            $('body').append(this.$el);
            this.$el.html(this.template());
            var canvas  = document.getElementById('game');
            if (canvas) {
                context = canvas.getContext('2d');
                context.beginPath();
                context.arc(150, 75, 50, 0, 2 * Math.PI, false);
                context.lineWidth = 15;
                context.strokeStyle = '#0f0';
                context.stroke();
            }
            return this;
        },
        show: function () {
            this.render();
            this.$el.show();
        },
        hide: function () {
            this.$el.hide();
        }

    });

    return new View();
});