define([
	'backbone',
	'models/score'
], function(
	Backbone,
	Score
) {
	var Collection = Backbone.Collection.extend({
		model: Score,
		url: '/scores',
		comparator: function(Score) {
			return -Score.get("score");
		},
		initialize: function() {
			this.on('add', this.onModelAdded, this);
		},
		onModelAdded: function(model, collection, options) {
			model.save(null, {
				wait: true,
				error: this.saveModelInLocalStorage.bind(this)
			});
		},
		saveModelInLocalStorage: function(model, xhr, options) {
			var scores;
			if (localStorage["arcanoid.scores"]) {
				scores = JSON.parse(localStorage["arcanoid.scores"]);
			} else {
				scores = [];
			}
			scores.push(model);
			localStorage["arcanoid.scores"] = JSON.stringify(scores);
		}
	});
	return new Collection();
});