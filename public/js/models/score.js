define([
    'backbone'
], function(
    Backbone
){

    var Model = Backbone.Model.extend({
    	urlRoot: '/scores',
        defaults: {
        	name: '',
        	score: 0
        }
    });

    return Model;
});