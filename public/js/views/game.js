define([
    'backbone',
    'tmpl/game'
], function(
    Backbone,
    tmpl
){

    var View = Backbone.View.extend({

        template: tmpl,
        el: '#page',
        initialize: function () {
            
        },
        render: function () {
            var canvas  = document.getElementById('game');
            if (canvas) {
                context = canvas.getContext('2d');
                context.beginPath();
                context.arc(150, 75, 50, 0, 2 * Math.PI, false);
                context.lineWidth = 15;
                context.strokeStyle = '#0f0';
                context.stroke();
            }
        },
        show: function () {
            this.$el.html(this.template());
        },
        hide: function () {
            // TODO
        }

    });

    return new View();
});