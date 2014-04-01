define(['backbone',
    'view_manager',
    'views/main',
    'views/scoreboard',
    'views/game'
], function(
    Backbone, ViewManager, MainView, ScoreboardView, GameView) {
    var args = arguments;
    var Router = Backbone.Router.extend({

        routes: {
            'scoreboard': 'scoreboardAction',
            'game': 'gameAction',
            '*default': 'defaultActions'
        },
        initialize: function() {
            for (var i = 2; i < args.length; i++) {
                ViewManager.views.push(args[i]);
            }
            ViewManager.addListeners();
        },
        defaultActions: function() {
            MainView.show();
        },
        scoreboardAction: function() {
            ScoreboardView.show();
        },
        gameAction: function() {
            GameView.show();
        }
    });

    return new Router();
});