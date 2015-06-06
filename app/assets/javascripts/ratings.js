(function(){
  var w = $(".ratings-show .rating");

  if(w.length == 1) {
    var items = DATA["ratings/items"].map(function(item) {
      return new ItemModel(item.item);
    });

    var rating = new RatingView({ el: w, collection: items, rating_path: w.data("rating-url") }); 
    rating.render();
  }
})()
