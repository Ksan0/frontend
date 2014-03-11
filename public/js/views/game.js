define([
    'backbone',
    'tmpl/game',
    'models/game',
    'models/padding',
    'views/padding',
    'models/ball',
    'views/ball'
], function(
    Backbone,
    tmpl,
    Game,
    PaddingModel,
    PaddingView,
    BallModel,
    BallView
){

    var View = Backbone.View.extend({
        template: tmpl,
        bgImagePath: 'css/images/bgImage.jpg',
        basePaddingWidth: 80,
        basePaddingHeight: 20,
        baseGameWidth: 360,
        baseGameHeight: 640,
        baseBottomOffset: 40,
        baseLeftOffset: 20,
        baseRightOffset: 20,
        baseTopOffset: 20,
        baseBallRadius: 10,
        game: null,
        canvas: null,
        context: null,
        paddingModel: null,
        paddingView: null,
        ballModel: null,
        ballView: null,
        FPS: 50,

        initialize: function () {
            this.$el.html(this.template());
            $('.content_wrapper').append(this.$el);
            this.canvas = this.$el.find(".game__position")[0];
            this.context = this.canvas.getContext("2d");
            this.canvas.width = this.baseGameWidth;
            this.canvas.height = this.baseGameHeight;
            this.context.setTransform(1, 0, 0, -1, this.canvas.width/2, this.canvas.height - this.baseBottomOffset);
            
            this.game = new Game({
                width: this.canvas.width,
                height: this.canvas.height,
                topOffset: this.baseTopOffset,
                rightOffset: this.baseRightOffset,
                leftOffset: this.baseLeftOffset,
                bottomOffset: this.baseBottomOffset
            });
            this.paddingModel = new PaddingModel({
                width: this.basePaddingWidth,
                height: this.basePaddingHeight,
                game: this.game
            });
            alert(this.paddingModel.get("game"));
            this.paddingView = new PaddingView ({
                "context": this.context,
                model: this.paddingModel
            });
            this.ballModel = new BallModel({
                x: 0,
                y: this.baseBallRadius,
                radius: this.baseBallRadius,
                "game": this.game,
                velocity: 5,
                angle: Math.PI/4
            });
            this.ballView = new BallView({
                
                context: this.context,
                model: this.ballModel
            });
            $(document).on('keydown', this.keypressed.bind(this));
            setInterval(
            function(){this.step()}.bind(this), 1000/this.FPS);
        },
        render: function () {
            return this;
        },
        show: function () {
            //this.render();
            this.$el.show();
        },
        hide: function () {
            this.$el.hide();
        },
        keypressed: function(e) {
            switch(e.keyCode) {
                case 37:
                    this.paddingModel.set("position", this.paddingModel.get("position") - 5);
                    break;
                case 39:
                    this.paddingModel.set("position", this.paddingModel.get("position") + 5);
                    break;
                default:
                    alert("NO");
                    break;
            }
        },

        step: function() {
            console.log("z");
            this.ballModel.step();
        }


    });
    return new View();
});