define([
    'backbone',
    'tmpl/game_over',
    'collections/scores'
], function(
    Backbone,
    tmpl,
    scores
) {
    var View = Backbone.View.extend({
        template: tmpl,
        defaults: {
            score: 0,
        },
        initialize: function(options) {
            this.$el.html(this.template({
                score: this.score
            }));
            $('.content_wrapper').append(this.$el);
            this.hidden = false;
            this.hide();
        },
        render: function() {
            this.$el.html(this.template({
                score: this.score
            }));

            $(document).find('.win__game')[0].innerHTML = this.winGame ? "Затащил" : "Потрачено";
            $(document).find('#gameOverForm')[0].style.display = this.winGame ? "" : "none";
            $(document).find('.restart__game')[0].style.display = this.winGame ? "none" : "";

            $('.restart__game', this.el).on('click', this.hide.bind(this));
            $('#gameOverForm', this.el).on('submit', this.addResult.bind(this));
            return this;
        },
        show: function(score, winGame) {
            this.score = score;
            this.winGame = winGame;
            this.hidden = false;

            this.render();
            this.$el.show();
        },
        hide: function() {
            this.hidden = true;
            this.$el.hide();
        },
        isHidden: function() {
            return this.hidden;
        },
        addResult: function(event) {
            event.preventDefault();
            var username = $('#username').val();
            if (username != "") {
                scores.add({
                    name: username,
                    score: this.score
                });
                window.location.hash = '#main';
                this.hide();
            }
        }
    });
    return View;
});