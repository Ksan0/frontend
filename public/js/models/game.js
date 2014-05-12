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
            //this.trigger("gameOver");
        },
        restart: function () {
            this.set("stop", true);
            this.set("stage", 1);
            this.set("score", 0);
        },
        addScore: function(count) {
            var score = this.get("score");
            this.set("score", score + count);
        },
        getScore: function() {
            return this.get("score");
        }
    });
    return Model;
});