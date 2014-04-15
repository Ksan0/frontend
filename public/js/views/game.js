define([
    'backbone',
    'tmpl/game',
    'models/game',
    'models/padding',
    'views/padding',
    'models/ball',
    'views/ball',
    'views/game_over'
], function (Backbone, tmpl, Game, PaddingModel, PaddingView, BallModel, BallView, GameOverView) {

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
        baseTopOffset: 100,
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
            this.context.setTransform(1, 0, 0, -1, this.canvas.width / 2, this.canvas.height - this.baseBottomOffset);

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
            this.paddingView = new PaddingView({
                context: this.context,
                model: this.paddingModel
            });
            this.ballModel = new BallModel({
                x: 0,
                y: this.baseBallRadius,
                radius: this.baseBallRadius,
                game: this.game,
                velocity: 5,
                angle: Math.PI / 4,
                padding: this.paddingModel
            });
            this.ballView = new BallView({
                context: this.context,
                model: this.ballModel
            });
            this.gameOverView = new GameOverView();
            $(document).on('keydown', this.keydown.bind(this));
            $(document).on('keyup', this.keyup.bind(this));
            this.game.on('gameOver', this.gameOver.bind(this));
            setInterval(
                function () {
                    this.step();
                }.bind(this), 1000 / this.FPS);
        },
        render: function () {
            return this;
        },
        show: function () {
            this.$el.show();
            console.log(this.ballModel);
            this.trigger('show', this);
        },
        hide: function () {
            this.$el.hide();
        },
        keydown: function (e) {
            switch (e.keyCode) {
                case 37:
                    this.leftButtonPressed = true;
                    break;
                case 39:
                    this.rigthButtonPressed = true;
                    break;
                case 32:
                    var stopped = this.game.get('stop');
                    if (stopped)
                        this.game.start();
                    else
                        this.game.pause();
                    break;
                default:
                    break;
            }
        },
        keyup: function (e) {
            switch (e.keyCode) {
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
        step: function () {
            var stopped = this.game.get('stop');
            if (!stopped) {
                if (this.leftButtonPressed)
                    this.paddingModel.moveLeft();
                if (this.rigthButtonPressed)
                    this.paddingModel.moveRight();
                this.ballModel.move();
            }
        },
        gameOver: function (e) {
            this.game.stop();
            this.gameOverView.show(this.game.get("score"));
        }
    });
    return new View();
});