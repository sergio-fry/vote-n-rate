var RatingModel = Backbone.Model.extend({
  validate: function(attrs) {
    if(attrs.title.trim() == "") {
      return "Заголовок не может быть пустым";
    }
  }
})

