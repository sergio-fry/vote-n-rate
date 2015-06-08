(function(){
  window.DisplayRating = function(current_user) {
    var w = $(".ratings-show .rating");

    if(w.length == 1) {
      var collection = new ItemsCollection(DATA["ratings/items"]);
      collection.rating_path = w.data("rating-path");

      var rating = new RatingView({ el: w, collection: collection, rating_path: w.data("rating-url") }); 
      rating.can_edit = current_user.get("id") == (DATA["ratings/user_id"]).toString();
      rating.id = DATA["ratings/id"];
      rating.render();


      if(rating.can_edit) {
        new NewItemFormView({ el: $(".new-item-form"), collection: collection }).render();
      }
    }
  }
})()
