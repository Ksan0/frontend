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
        },
        render: function () {
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