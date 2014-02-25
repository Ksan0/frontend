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
            function drawCircle(x, y, r) {
                context.arc(x, y, r, 0, 2 * Math.PI, false);
            }
            context.beginPath();
            drawCircle(150, 75, 50);
            context.lineWidth   = 15;
            context.strokeStyle = '#0f0';
            context.stroke();
            }
        else
            alert(canvas);
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