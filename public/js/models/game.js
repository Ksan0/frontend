define([
    'backbone',
    'models/padding'
], function(
    Backbone,
    Padding
) {

    var Model = Backbone.Model.extend({
        defaults: {
            stop: true,
            stage: 1,
            score: 0,
        },
        initialize: function() {},
        start: function() {
            this.set('stop', false);
        },
        pause: function() {
            this.set('stop', true);
        },
        stop: function() {
            this.set('stop', true);
        },
        over: function() {
            this.trigger("gameOver");
        },
        reset: function () {
            this.stop = true;
            this.stage = 1;
            this.score = 0;
        }
    });
    return Model;
});