var RatingView = Backbone.View.extend({
  initialize: function(options) {
    this.rating_path = options.rating_path;
  },

  render: function() {
    var self = this;

    _(this.collection).each(function(item, i) {
      var view = new ItemView({model: item});
      view.position = i + 1;
      view.rating_path = self.rating_path;
      self.$el.append(view.render().$el);
    })
  }
})

