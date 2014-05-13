require.config({
    urlArgs: "_=" + (new Date()).getTime(),
    baseUrl: "js",
    paths: {
        jquery: "lib/jquery",
        underscore: "lib/underscore",
        backbone: "lib/backbone",
        Connector: "lib/Connector",
        FnQuery: "lib/FnQuery",
        "socket.io": "/socket.io/socket.io",
        modernizr: "lib/modernizr-dev"
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        "socket.io": {
            exports: "io"
        },
        'modernizr': {
            exports: "modernizr"
        },
    }
});

define([
    'Connector'
], function(
    Connector
){
    var input = document.getElementById('token');
    var start, init, reconnect;

    var inputDiv = document.getElementsByClassName("token")[0];
    var mainDiv = document.getElementsByClassName("main")[0];

    window.addEventListener("deviceorientation", move, false);
    // Создаем связь с сервером
    var server = new Connector({
            server: ['bind'],
            remote: '/player'
        }
    );

    function move(e){
        console.log(e);
        var position = {
            alpha : e.alpha,
            beta : e.beta,
            gamma : e.gamma
        }
        server.send({
            type: 'move',
            position: position
        })
    }

    // Инициализация
    init = function(){
        // Если id нет
        if (!localStorage.getItem('playerguid')){
            // Ждем ввода токена
            input.parentNode.addEventListener('submit', function(e){
                e.preventDefault();
                console.log("submit");
                // И отправляем его на сервер
                server.bind({token: input.value}, function(data){
                    if (data.status == 'success'){ //  В случае успеха
                        // Стартуем джостик
                        start(data.guid);
                        inputDiv.style.visibility = "hidden";
                        mainDiv.style.visibility = "visible";

                    }
                });
            }, false);

        } else { // иначе
            // переподключаемся к уже созданной связке
            reconnect();
        }
    };

    // Переподключение
    // Используем сохранненный id связки
    reconnect = function(){
        server.bind({guid: localStorage.getItem('playerguid')}, function(data){
            // Если все ок
            if (data.status == 'success'){
                // Стартуем
                start(data.guid);
                inputDiv.style.visibility = "hidden";
                mainDiv.style.visibility = "visible";
            // Если связки уже нет
            } else if (data.status == 'undefined guid'){
                // Начинаем все заново
                localStorage.removeItem('playerguid');
                init();
            }
        });
    };

    // Старт игры
    start = function(guid){
        console.log('start player');
        // Сохраняем id связки
        localStorage.setItem('playerguid', guid);
    };

    server.on('reconnect', reconnect);

    init();

    // Обмен сообщениями
    server.on('message', function(data, answer){
        console.log('message', data);
        answer('answer');
    });

    window.server = server;

    /*
    server.send('message', function(answer){
        console.log(answer);
    });
    */
});