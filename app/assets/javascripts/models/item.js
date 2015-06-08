var ItemModel = Backbone.Model.extend({
  defaults: {
    "rating": 0,
  },
  url: function() {
    var url;

    if(this.isNew()){
      url = this.collection.items_path;
    } else {
      if(this.collection == undefined) return; //oops
      url = this.collection.items_path + "/" + this.id;
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
