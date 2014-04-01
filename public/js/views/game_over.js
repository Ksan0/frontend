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
        initialize: function(options) {
            this.$el.html(this.template({
                score: 0
            }));
            this.score = options.score;
            $('.content_wrapper').append(this.$el);

            this.hide();
        },
        render: function() {
            this.$el.html(this.template({
                score: this.score
            }));
            $('#gameOverForm').on('submit', this.addResult.bind(this));
            return this;
        },
        show: function(score) {
            this.score = score;
            this.render();
            this.$el.show();
        },
        hide: function() {
            this.$el.hide();
        },
        addResult: function(event) {
            event.preventDefault();
            var username = $('#username').val();
            scores.add({
                name: username,
                score: this.score
            });
            window.location.hash = '#main';
            this.hide();
        }
    });
    return View;
});