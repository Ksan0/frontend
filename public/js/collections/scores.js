define([
	'backbone',
	'models/score'
], function(
	Backbone,
	Score
){
	var Collection = Backbone.Collection.extend({
		model: Score,
		comparator: function(Score) {
			return -Score.get("score");
		},
		initialize: function(){
			this.add(new Score({name: "name1", score: 10}));
			this.add(new Score({name: "name2", score: 9}));
			this.add(new Score({name: "name3", score: 8}));
			this.add(new Score({name: "name4", score: 7}));
			this.add(new Score({name: "name5", score: 6}));
			this.add(new Score({name: "name6", score: 7}));
			this.add(new Score({name: "name7", score: 8}));
			this.add(new Score({name: "name8", score: 9}));
			this.add(new Score({name: "name9", score: 10}));
			this.add(new Score({name: "name10", score: 1}));
		}
	});
	return new Collection();
});