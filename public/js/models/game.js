define([
    'backbone',
    'models/padding'
], function(
    Backbone,
    Padding
){

    var Model = Backbone.Model.extend({
        
        defaults: {
            width: 360,
            height: 640,
        	stage: 1,
        	score: 0,
            bottomOffset: 20,
            leftOffset: 20,
            rightOffset: 20,
            topOffset: 20
        },
        initialize: function() {

        }
        start: function() {

        }
        pause: function() {

        }
        over: function() {
            
        }
    });

    return Model;
});