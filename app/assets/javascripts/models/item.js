var ItemModel = Backbone.Model.extend({
  url: function() {
    return this.rating_path + "/items/" + this.id;
  }
})

var ItemsCollection = Backbone.Collection.extend({
    model: ItemModel
});
