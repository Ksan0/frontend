define([
    'backbone',
    'tmpl/main'
], function(
    Backbone,
    tmpl
){

    var View = Backbone.View.extend({
        template: tmpl,
        initialize: function () {
            this.$el.html(this.template());
            $('.content_wrapper').append(this.$el);
        },
        render: function () {
            return this;
        },
        show: function () {
            this.$el.show();
            this.trigger('show', this);
        },
        hide: function () {
            this.$el.hide();
        }

    });

    return new View();
});