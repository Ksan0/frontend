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
            this.$el.html(this.template({scores: scores.toJSON()}));
            $('.content_wrapper').append(this.$el);
            this.hide();
        },
        render: function () {
            console.log(scores.fetch);
            scores.fetch({
                data:{limit:10}
            });
            this.$el.html(this.template({scores: scores.toJSON()}));
            return this;
        },
        show: function () {
            this.render();
            this.$el.show();
            this.trigger('show', this);
        },
        hide: function () {
            this.$el.hide();
        }
    });
    return new View();
});