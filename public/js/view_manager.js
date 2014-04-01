define([
        'backbone'
    ],
    function(Backbone) {
        var ViewManager = Backbone.Model.extend({
            views: [],
            addListeners: function() {

                var views = this.views;
                for (var i = 0; i < views.length; i++) {
                    this.listenTo(views[i], 'show', function(object) {
                        views.forEach(function(entry) {
                            if (object.cid != entry.cid) entry.hide();
                        });
                    });
                }
            }
        });
        return new ViewManager();
    }
);