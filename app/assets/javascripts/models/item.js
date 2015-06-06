var ItemModel = Backbone.Model.extend({
  url: function() {
    return this.rating_path + "/items/" + this.id;
  },

  toJSON: function() {
    return { item: _.clone( this.attributes ) }
  },
})

var ItemsCollection = Backbone.Collection.extend({
    model: ItemModel
});
