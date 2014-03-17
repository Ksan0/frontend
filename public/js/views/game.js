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
        leftButtonPressed: false,
        rigthButtonPressed: false,

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
            this.paddingView = new PaddingView ({
                context: this.context,
                model: this.paddingModel
            });
            this.ballModel = new BallModel({
                x: 0,
                y: this.baseBallRadius,
                radius: this.baseBallRadius,
                game: this.game,
                velocity: 5,
                angle: Math.PI/4,
                padding: this.paddingModel
            });
            this.ballView = new BallView({
                context: this.context,
                model: this.ballModel
            });
            console.log(this.ballModel);
            console.log(this.ballView);
            console.log(this.paddingModel);
            console.log(this.paddingView);
            $(document).on('keydown', this.keydown.bind(this));
            $(document).on('keyup', this.keyup.bind(this));
            setInterval(
            function(){this.step()}.bind(this), 1000/this.FPS);
        },
        render: function () {
            return this;
        },
        show: function () {
            this.$el.show();
        },
        hide: function () {
            this.$el.hide();
        },
        keydown: function(e) {
            switch(e.keyCode) {
                case 37:
                    this.leftButtonPressed = true;
                    break;
                case 39:
                    this.rigthButtonPressed = true;
                    break;
                default:
                    alert("NO");
                    break;
            }
        },
        keyup: function(e) {
            switch(e.keyCode) {
                case 37:
                    this.leftButtonPressed = false;
                    break;
                case 39:
                    this.rigthButtonPressed = false;
                    break;
                default:
                    break;
            }
        },
        step: function() {
            if (this.leftButtonPressed)
                this.paddingModel.moveLeft();
            if (this.rigthButtonPressed)
                this.paddingModel.moveRight();
            this.ballModel.move();
        }


    });
    return new View();
});