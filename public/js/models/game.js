define([
    'backbone',
    'models/padding'
], function(
    Backbone,
    Padding
){

    var Model = Backbone.Model.extend({
        defaults: {
            stop: true,
        	stage: 1,
        	score: 0,
        },
        initialize: function() {
        },
        start: function() {
            this.set('stop', false);
        },
        stop: function() {
            this.set('stop', true);
        },
        over: function() {
            this.trigger("gameOver");
        },
        stopped: function() {
            return stop;
        }
    });

    return Model;
});