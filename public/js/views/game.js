define([
    'backbone',
    'tmpl/game',
    'models/game',
    'views/padding'
], function(
    Backbone,
    tmpl,
    Game,
    PaddingView
){

    var View = Backbone.View.extend({
        bgImagePath: 'css/images/bgImage.jpg',

        initialize: function () {
            this.template = tmpl;
            this.$el.html(this.template());
            this.canvas = this.$el.find(".gameCanvas")[0];
            this.context = this.canvas.getContext("2d");
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.bgImage = new Image();
            this.bgImage.src = this.bgImagePath;
            this.context.setTransform(1, 0, 0, -1, this.canvas.width/2, this.canvas.height);
            this.game = new Game(this.width, this.height);
        },
        render: function () {
            $('body').append(this.$el);
            this.drawBackground();
            return this;
        },
        show: function () {
            this.render();
            this.$el.show();
        },
        hide: function () {
            this.$el.hide();
        },
        drawBackground: function() {
            this.context.drawImage(this.bgImage, -this.width/2, 0, this.width, this.height);
        }
    });

    return new View();
});