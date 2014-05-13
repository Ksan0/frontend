define([
    'backbone'
], function(
    Backbone
) {
    var View = Backbone.View.extend({
        initialize: function(options) {
            //this.model.on("change:x change:y", this.render, this);
            this.context = options.context;
            this.image = options.image;
            this.image_angle = 0;
            this.model.set('lastDrawX', 0);
            this.model.set('lastDrawY', 0);
            //this.render();
        },
        render: function() {
            var r = this.model.get('radius');
            var x = this.model.get('x');
            var y = this.model.get('y');
            var prevx = this.model.get('lastDrawX');
            var prevy = this.model.get('lastDrawY');

            this.context.clearRect(prevx - 2*r, prevy - 2*r, 2*2*r, 2*2*r);
            this.context.clearRect(this.model.get('default_x') - 2*r, this.model.get('default_y') - 2*r, 2*2*r, 2*2*r);
            if (!this.model.get("game_over")) {
                var angle = this.image_angle + this.model.get('rotation');
                var sin = Math.sin(angle);
                var cos = Math.cos(angle);

                this.context.translate(x, y);
                this.context.transform(cos, sin, -sin, cos, 0, 0);
                
                this.context.drawImage(this.image, -r, -r, 2*r, 2*r);
                
                this.image_angle = angle;
                this.context.transform(cos, -sin, sin, cos, 0, 0);
                this.context.translate(-x, -y);

                this.model.set('lastDrawX', x);
                this.model.set('lastDrawY', y);
            }
        },
        show: function() {
            
        },
        hide: function() {}
    });
    return View;
});