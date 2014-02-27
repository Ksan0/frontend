define([
    'backbone',
    'tmpl/scoreboard',
    'collections/scores'
], function(
    Backbone,
    tmpl,
    scores
){

    var View = Backbone.View.extend({
        template: tmpl,
        initialize: function () {
            // TODO
        },
        render: function () {
            $('body').append(this.$el);
            this.$el.html(this.template({scores: scores.toJSON()}));
            return this;
        },
        show: function () {
            this.render();
            this.$el.show();
        },
        hide: function () {
            this.$el.hide();
        }

    });
    return new View();
});