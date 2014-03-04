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
        
        initialize: function () {
            this.template = tmpl;
            this.$el.html(this.template({scores: scores.toJSON()}));
        },
        render: function () {
            this.$el.html(this.template({scores: scores.toJSON()}));
            $('body').append(this.$el);
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