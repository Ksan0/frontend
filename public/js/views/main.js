define([
    'backbone',
    'tmpl/main'
], function(
    Backbone,
    tmpl
){

    var View = Backbone.View.extend({
        initialize: function () {
            this.template = tmpl;
            this.$el.html(this.template());
            $('body').append(this.$el);
        },
        render: function () {
            return this;
        },
        show: function () {
            this.$el.show();
        },
        hide: function () {
            this.$el.hide();
        }

    });

    return new View();
});