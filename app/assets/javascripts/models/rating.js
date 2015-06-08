var RatingModel = Backbone.Model.extend({
  url: function() {
    return "/ratings/" + this.id;
  },

  toJSON: function() {
    return { rating: _.clone( this.attributes ) }
  },

  validate: function(attrs) {
    if(!!attrs && (attrs.title || "").trim() == "") {
      return "Заголовок не может быть пустым";
    }
  }
})

