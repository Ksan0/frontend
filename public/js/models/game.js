define([
    'backbone',
    'models/padding'
], function(
    Backbone,
    Padding
){

    var Model = Backbone.Model.extend({
        defaults: {
            pause: true,
        	stage: 1,
        	score: 0,
        },
        initialize: function() {
        },
        start: function() {
            this.set('pause', false);
        },
        pause: function() {
            this.set('pause', true);
        },
        over: function() {

        }
    });

    return Model;
});