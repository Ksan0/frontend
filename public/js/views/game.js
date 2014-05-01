define([
    'backbone',
    'tmpl/game',
    'models/game',
    'models/padding',
    'views/padding',
    'models/blocks',
    'views/blocks',
    'models/ball',
    'views/ball',
    'views/game_over'
], function (Backbone, tmpl, Game, PaddingModel, PaddingView, BlocksModel, BlocksView, BallModel, BallView, GameOverView) {

    var View = Backbone.View.extend({
        template: tmpl,
        bgImagePath: 'css/images/bgImage.jpg',
        basePaddingWidth: 80,
        basePaddingHeight: 20,
        baseGameWidth: 360,
        baseGameHeight: 640,
        baseBottomOffset: 10,
        baseLeftOffset: 20,
        baseRightOffset: 20,
        baseTopOffset: 100,
        baseBallRadius: 10,
        game: null,
        canvas: null,
        context: null,
        canvas2: null,
        context2: null,
        paddingModel: null,
        paddingView: null,
        blocksModel: null,
        blocksView: null,
        ballModel: null,
        ballView: null,
        FPS: 100,
        lastFrapTime: null,
        deltaFrapTime: 0,
        leftKeyPressed: false,
        rigthKeyPressed: false,
        upKeyPressed: false,
        downKeyPressed: false,

        initialize: function() {
            this.$el.html(this.template());
            $('.content_wrapper').append(this.$el);
            this.canvas = this.$el.find(".game__position")[0];
            this.context = this.canvas.getContext("2d");
            this.canvas.width = this.baseGameWidth;
            this.canvas.height = this.baseGameHeight;
            this.context.setTransform(1, 0, 0, -1, this.canvas.width / 2, this.canvas.height - this.baseBottomOffset);

            this.canvas2 = this.$el.find(".game__position")[1];
            this.context2 = this.canvas2.getContext("2d");
            this.canvas2.width = this.baseGameWidth;
            this.canvas2.height = this.baseGameHeight;
            this.context2.setTransform(1, 0, 0, -1, this.canvas2.width / 2, this.canvas2.height - this.baseBottomOffset);

            this.game = new Game({
                width: this.canvas.width,
                height: this.canvas.height,
                topOffset: this.baseTopOffset,
                rightOffset: this.baseRightOffset,
                leftOffset: this.baseLeftOffset,
                bottomOffset: this.baseBottomOffset
            });
            this.paddingModel = new PaddingModel({
                x: 0,                           // center of block
                y: this.baseBottomOffset + 25,  // center of block
                max_y: this.baseBottomOffset + 100,
                speed_x: 0,
                speed_y: 0,
                max_speed_x: 50,                     // speed use when user press key
                max_speed_y: 50,
                acceleration_x: 50,
                acceleration_y: 100,
                friction_x: 25,
                friction_y: 50,
                width: this.basePaddingWidth,
                height: this.basePaddingHeight,
                game: this.game
            });
            this.paddingView = new PaddingView({
                context: this.context,
                model: this.paddingModel
            });
            this.blocksModel = new BlocksModel({
                game: this.game
            });
            this.blocksView = new BlocksView({
                context: this.context,
                model: this.blocksModel
            });
            this.ballModel = new BallModel({
                x: 0,
                y: this.paddingModel.get("y") + 2*this.baseBallRadius,
                radius: this.baseBallRadius,
                game: this.game,
                velocity: 200,
                angle: Math.PI / 4 + Math.PI / 2 * Math.random(),
                padding: this.paddingModel,
                blocks: this.blocksModel,
                scoreDiv: this.$el.find(".game__info")[0]
            });
            this.ballView = new BallView({
                context: this.context2,
                model: this.ballModel
            });
            this.gameOverView = new GameOverView({
                score: 1 // this.game.get("score") ?
            });
            $(document).on('keydown', this.keydown.bind(this));
            $(document).on('keyup', this.keyup.bind(this));
            setInterval(
                function() {
                    this.step();
                }.bind(this), 1000 / this.FPS);

            var loader = $(document).find('.resources__loader')[0];
            loader.style.display = 'none';

            this.lastFrapTime = (new Date()).getTime();
        },
        render: function() {
            return this;
        },
        show: function() {
            this.$el.show();
            this.trigger('show', this);
        },
        hide: function() {
            this.$el.hide();
        },
        keydown: function(e) {
            switch (e.keyCode) {
                case 37:
                    this.leftKeyPressed = true;
                    break;
                case 38:
                    this.upKeyPressed = true;
                    break;
                case 39:
                    this.rigthKeyPressed = true;
                    break;
                case 40:
                    this.downKeyPressed = true;
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
        keyup: function(e) {
            switch (e.keyCode) {
                case 37:
                    this.leftKeyPressed = false;
                    break;
                case 38:
                    this.upKeyPressed = false;
                    break;
                case 39:
                    this.rigthKeyPressed = false;
                    break;
                case 40:
                    this.downKeyPressed = false;
                    break;
                default:
                    break;
            }
        },
        step: function() {
            var currentFrapTime = (new Date()).getTime();
            var lastFrapTime = this.game.get('lastFrapTime');
            this.game.set('deltaFrapTime', (currentFrapTime - lastFrapTime)/1000);
            this.game.set('lastFrapTime', currentFrapTime);

            var stopped = this.game.get('stop');
            if (!stopped) {
                this.paddingModel.move(this.leftKeyPressed, this.rigthKeyPressed, this.upKeyPressed, this.downKeyPressed);
            
                this.ballModel.move(this.leftKeyPressed, this.rigthKeyPressed);
                if (this.ballModel.get("game_over")) {
                    this.thisGameOver();
                }
            }
        },
        thisGameOver: function(e) {
            var score = this.game.get("score");
            this.game.restart();
            this.paddingModel.restart();
            this.blocksModel.restart();
            this.ballModel.restart();
            this.ballModel.set("game_over", false);
            this.ballView.render();

            this.gameOverView.show(score);
        }
    });
    return new View();
});