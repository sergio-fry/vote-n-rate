(function(){
  var w = $(".ratings-show .rating");

  if(w.length == 1) {
    var items = DATA["ratings/items"].map(function(item) {
      var model =  new ItemModel(item.item);
      model.rating_path = w.data("rating-url");

      return model;
    });

    var rating = new RatingView({ el: w, collection: new ItemsCollection(items), rating_path: w.data("rating-url") }); 
    rating.render();
  }
})()
