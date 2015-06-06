(function(){
  var w = $(".ratings-show .rating");

  if(w.length == 1) {
    var collection = new ItemsCollection(DATA["ratings/items"], { rating_id: 123 });
    collection.rating_path = w.data("rating-path");

    var rating = new RatingView({ el: w, collection: collection, rating_path: w.data("rating-url") }); 
    rating.render();


    new NewItemFormView({ el: $(".new-item-form"), collection: collection }).render();

  }
})()
