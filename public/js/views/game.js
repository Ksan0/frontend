define([
    'backbone',
    'Connector',
    'tmpl/game',
    'models/game',
    'models/padding',
    'views/padding',
    'models/blocks',
    'views/blocks',
    'models/ball',
    'views/ball',
    'views/game_over'
], function (Backbone, Connector, tmpl, Game, PaddingModel, PaddingView, BlocksModel, BlocksView, BallModel, BallView, GameOverView) {

    var View = Backbone.View.extend({
        template: tmpl,
        bgImagePath: 'css/images/bgImage.jpg',
        basePaddingWidth: 80,
        basePaddingHeight: 20,
        baseGameWidth: 640,
        baseGameHeight: 640,
        baseBottomOffset: 10,
        baseLeftOffset: 20,
        baseRightOffset: 20,
        baseTopOffset: 90,
        baseBallRadius: 18,
        game: null,
        canvas: null,
        context: null,
        canvas2: null,
        context2: null,
        canvas3: null,
        context3: null,
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

            var self = this;
            var start, init, reconnect;

            // Создаем связь с сервером
            var server = new Connector({
                    server: ['getToken', 'bind'],
                    remote: '/console'
                }
            );

            // На подключении игрока стартуем игру
            server.on('player-joined', function(data){
                // Передаем id связки консоль-джостик
                start(data.guid);
            });

            // Инициализация
            init = function(){
                // Если id нет
                if (!localStorage.getItem('consoleguid')){
                    // Получаем токен
                    server.getToken(function(token){
                        self.token = token;
                        self.insertToken();
                    });
                } else { // иначе
                    // переподключаемся к уже созданной связке
                    reconnect();
                }
            };

            // Переподключение
            reconnect = function(){
                // Используем сохранненный id связки
                server.bind({guid: localStorage.getItem('consoleguid')}, function(data){
                    // Если все ок
                    if (data.status == 'success'){
                        // Стартуем
                        start(data.guid);
                    // Если связки уже нет
                    } else if (data.status == 'undefined guid'){
                        // Начинаем все заново
                        localStorage.removeItem('consoleguid');
                        init();
                    }
                });
            };

            server.on('reconnect', reconnect);

            // Старт игры
            start = function(guid){
                console.log('start console');
                // Сохраняем id связки
                localStorage.setItem('consoleguid', guid);
            };

            init();

            // Обмен сообщениями
            server.on('message', function(data, answer){
                self.handleJoystick(data);
                answer('answer');
            });

            window.server = server;


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

            this.canvas3 = this.$el.find(".game__position")[2];
            this.context3 = this.canvas3.getContext("2d");
            this.canvas3.width = this.baseGameWidth;
            this.canvas3.height = this.baseGameHeight;
            this.context3.setTransform(1, 0, 0, -1, this.canvas2.width / 2, this.canvas2.height - this.baseBottomOffset);

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
                max_y: this.baseBottomOffset + 200,
                speed_x: 0,
                speed_y: 0,
                max_speed_x: 150,                     // speed use when user press key
                max_speed_y: 75,
                acceleration_x: 200,
                acceleration_y: 200,
                friction_x: 50,
                friction_y: 50,
                width: this.basePaddingWidth,
                height: this.basePaddingHeight,
                game: this.game
            });
            
            var paddingImage = new Image();
            paddingImage.src = '/css/images/platform.png';
            this.paddingView = new PaddingView({
                context: this.context,
                model: this.paddingModel,
                img: paddingImage
            });
            this.blocksModel = new BlocksModel({
                game: this.game,
                padding: this.paddingModel
            });
            this.blocksView = new BlocksView({
                context: this.context,
                context_bonus: this.context3,
                model: this.blocksModel
            });
            this.ballModel = new BallModel({
                x: 0,
                y: this.paddingModel.get("y") + 1.5*this.baseBallRadius,
                radius: this.baseBallRadius,
                game: this.game,
                velocity: 200,
                angle: Math.PI / 4 + Math.PI / 2 * Math.random(),
                rotation: -6 * Math.PI / 180,
                rotation_inc: 0,
                friction: 1,
                padding: this.paddingModel,
                blocks: this.blocksModel,
                scoreDiv: this.$el.find(".game__score")[0],
                lifeDiv: this.$el.find(".game__life")[0],
                bonusDiv: this.$el.find(".game__bonus")[0]
            });
            this.blocksModel.set('ball', this.ballModel);
            var ballImage = new Image();
            ballImage.src = '/css/images/ball3.png';
            
            this.ballView = new BallView({
                context: this.context2,
                model: this.ballModel,
                image: ballImage
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

        insertToken: function() {
            var tokenItem = this.$el.find('.token-place')[0];
            tokenItem.innerHTML = this.token;
            console.log(tokenItem);
        },
        render: function() {
            this.context.beginPath();
            this.context.strokeStyle = '#777777';
            this.context.strokeRect(  -this.canvas.width/2 + this.baseLeftOffset,
                                this.baseBottomOffset,
                                this.baseGameWidth - this.baseLeftOffset - this.baseRightOffset,
                                this.baseGameHeight - this.baseTopOffset - 2*this.baseBottomOffset);
            this.context.closePath();
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
                    if (this.gameOverView.isHidden()) {
                        var stopped = this.game.get('stop');
                        if (stopped)
                            this.game.start();
                        else
                            this.game.pause();
                    }
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
            
                this.ballModel.move();
                if (this.ballModel.get("game_over")) {
                    this.thisGameOver();
                }

                //this.blocksModel.recovery();
                this.blocksModel.step();
            }

            this.blocksView.render();
            this.ballView.render();
            this.paddingView.render();
            this.render();
        },
        thisGameOver: function(e) {
            var score = this.game.get("score");
            var win = this.blocksModel.isWinGame();
            this.blocksView.clearAll();
            this.game.restart();
            this.paddingModel.restart();
            this.blocksModel.restart();
            this.ballModel.restart();
            this.ballModel.set("game_over", false);
            this.ballView.render();

            this.gameOverView.show(score, win);
        },

        handleJoystick: function(data) {
            var stopped = this.game.get('stop');


            if (data.type == 'move')
                var gamma;
                var beta;

                if (data.position.gamma < 0) {
                    this.leftKeyPressed = true;
                    this.rigthKeyPressed = false;
                }
                else {
                    this.leftKeyPressed = false;
                    this.rigthKeyPressed = true;
                }

                if (data.position.beta < 0) {
                    this.upKeyPressed = true;
                    this.downKeyPressed = false;
                } else {
                    this.upKeyPressed = false;
                    this.downKeyPressed = true;
                }
            if (data.type == 'pause')
                if (this.gameOverView.isHidden()) {
                    if (stopped)
                        this.game.start();
                    else
                        this.game.pause();
                }
        },
    });
    return new View();
});