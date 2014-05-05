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
            //this.render();
        },
        _rotate: function (img, angle) {
            var canvas = document.createElement("CANVAS");
            canvas.setAttribute("width", img.width);
            canvas.setAttribute("height", img.height);
            var ctx = canvas.getContext("2d");
            ctx.rotate(angle);
            ctx.drawImage(img, 0, 0, img.width, img.height);
            var img2 = new Image();
            img2.src = canvas.toDataURL();
            img2.width = canvas.width;
            img2.height = canvas.height;
            return img2;
        },
        render: function() {
            var r = this.model.get('radius');
            var x = this.model.get('x');
            var y = this.model.get('y');
            var prevx = this.model.get('prevx');
            var prevy = this.model.get('prevy');

            this.context.clearRect(prevx - 2*r, prevy - 2*r, 2*2*r, 2*2*r);
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
            }
        },
        show: function() {
            
        },
        hide: function() {}
    });
    return View;
});