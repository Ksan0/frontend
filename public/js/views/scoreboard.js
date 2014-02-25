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
        el: '#page',
        initialize: function () {
            // TODO
        },
        render: function () {
            // TODO
        },
        show: function () {
            this.$el.html(this.template({scores: scores.toJSON()}));
        },
        hide: function () {
            // TODO
        }

    });

    return new View();
});