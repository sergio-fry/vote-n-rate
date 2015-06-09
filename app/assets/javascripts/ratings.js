(function(){
  window.DisplayRating = function(current_user) {
    var w = $(".ratings-show .rating");

    if(w.length == 1) {
      var collection = new ItemsCollection(DATA["ratings/items"]);
      collection.items_path = DATA["ratings/items_path"];

      var can_edit = current_user.get("id") == (DATA["ratings/rating"].user_id).toString()

      var rating = new RatingView({ el: w.find(".rating-widget"), model: new RatingModel(DATA["ratings/rating"]) }); 
      rating.can_edit = can_edit;
      rating.render();

      var items_list = new ItemsListView({ el: w.find(".items"), collection: collection }); 
      items_list.can_edit = can_edit;
      items_list.rating_id = DATA["ratings/rating"].id
      items_list.render();

      if(can_edit) {
        new NewItemFormView({ el: $(".new-item-form"), collection: collection }).render();
      }
    }
  }
})()
