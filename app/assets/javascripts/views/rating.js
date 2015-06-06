var RatingView = Backbone.View.extend({
  initialize: function(options) {
    this.rating_path = options.rating_path;

    this.items = [];

    var self = this;

    this.collection.on("destroy", function(model) {
      self.items = _(self.items).reject(function(el) {
        return el.model == model;
      });

      self.update_order()
    });
    this.collection.on("change", function() { self.update_order() });
  },

  update_order: function() {
    var buf = $("<div>");
    var self = this;

    _.chain(this.items).sortBy(function(el) {
      return -el.model.get("rating");
    }).each(function(el, i) {
      el.position = i + 1;
      el.render()
      buf.append(el.$el);
    });

    this.$el.empty().append(buf);
  },

  render: function() {
    var self = this;

    var buf = $("<div>");

    _(this.collection.models).each(function(item, i) {
      var view = new ItemView({model: item});
      view.position = i + 1;
      view.rating_path = self.rating_path;
      buf.append(view.render().$el);

      self.items.push(view);
    })

    this.$el.empty().append(buf);
  }
})

