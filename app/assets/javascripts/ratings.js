(function(){
  window.DisplayRating = function(current_user) {
    var w = $(".ratings-show .rating");

    if(w.length == 1) {
      var collection = new ItemsCollection(DATA["ratings/items"]);
      collection.items_path = DATA["ratings/items_path"];

      var rating = new RatingView({ el: w, collection: collection, model: new RatingModel(DATA["ratings/rating"]) }); 
      rating.can_edit = current_user.get("id") == (DATA["ratings/rating"].user_id).toString();
      rating.render();

      if(rating.can_edit) {
        new NewItemFormView({ el: $(".new-item-form"), collection: collection }).render();
      }
    }
  }
})()
