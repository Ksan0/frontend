define([
    'backbone',
    'tmpl/scoreboard',
    'tmpl/loading',
    'tmpl/loading_failed',
    'collections/scores'
], function(
    Backbone,
    tmpl,
    tmpl_loading,
    tmpl_loading_failed,
    scores
) {
    var View = Backbone.View.extend({
        template: tmpl,
        template_loading: tmpl_loading,
        template_loading_failed: tmpl_loading_failed,
        initialize: function() {
            this.$el.html(this.template({
                scores: scores.toJSON()
            }));
            $('.content_wrapper').append(this.$el);
            this.hide();
        },
        renderLoading: function() {
            this.$el.html(this.template_loading());
            console.log("ЗАГРУЗКА");
            return this;
        },
        renderScoreboard: function() {
            this.$el.html(this.template({
                scores: scores.toJSON()
            }));
            console.log("ТАБЛИЦА ЗАГРУЖЕНА");
            return this;
        },
        renderError: function() {
            this.$el.html(this.template_loading_failed());
            console.log("ТАБЛИЦА НЕ ЗАГРУЖЕНА");
            return this;
        },
        show: function() {
            this.checkModelsInLocalStorage();
            scores.fetch({
                data: {
                    limit: 10
                },
                success: this.showScoreboard.bind(this),
                error: this.showErrorMessage.bind(this)
            });
            this.showLoading();
            this.trigger('show', this);
        },
        showScoreboard: function(collection, response, options) {
            this.renderScoreboard();
            this.$el.show();
        },
        showErrorMessage: function(collection, response, options) {
            this.renderError();
            this.$el.show();
        },
        showLoading: function() {
            this.renderLoading();
            this.$el.show();
        },
        hide: function() {
            this.$el.hide();
        },
        checkModelsInLocalStorage: function() {
            var localScores;
            if (localStorage["arcanoid.scores"]) {
                localScores = JSON.parse(localStorage["arcanoid.scores"]);
            } else {
                localScores = [];
            }
            console.log(localScores);
            localStorage.removeItem("arcanoid.scores");
            localScores.forEach(function(element, index, array) {
                scores.add({
                    name: element["name"],
                    score: element["score"]
                })
            });
        }
    });
    return new View();
});