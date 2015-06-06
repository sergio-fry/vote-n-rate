var ItemModel = Backbone.Model.extend({
  defaults: {
    "rating": 0,
  },
  url: function() {
    var url;

    if(this.isNew()){
      url = this.collection.rating_path + "/items";
    } else {this.collection.rating_path
      url = this.collection.rating_path + "/items/" + this.id;
    }

    return url;
  },

  toJSON: function() {
    return { item: _.clone( this.attributes ) }
  },

  validate: function(attrs) {
    if(attrs.title.trim() == "") {
      return "Заголовок не может быть пустым";
    }
  }
})

var ItemsCollection = Backbone.Collection.extend({
    model: ItemModel,
});
