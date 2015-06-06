var RatingView = Backbone.View.extend({
  initialize: function(options) {
    this.rating_path = options.rating_path;

    this.items = [];

    var self = this;

    this.collection.on("add", function(model) { self.add_item(model) });
    this.collection.on("change", function() { self.update_order() });
    this.collection.on("remove", function(model) { self.remove_item(model) });
  },

  remove_item: function(model) {
    this.items = _(this.items).reject(function(el) {
      return el.model == model;
    });

    this.update_order()
  },

  add_item: function(model) {
    var view = new ItemView({model: model});
    view.position = (this.items[this.items.length - 1] || {position: 0}).position + 1;
    this.items.push(view);

    this.$el.append(view.render().$el);

  },

  update_order: function() {
    var buf = $("<div>");
    var self = this;

    _.chain(this.items).sortBy(function(el) {
      return el.model.get("title");
    }).sortBy(function(el) {
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
      buf.append(view.render().$el);

      self.items.push(view);
    })

    this.$el.empty().append(buf);
    this.update_order();
  },

})

