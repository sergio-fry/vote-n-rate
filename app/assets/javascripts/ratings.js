(function(){
  var w = $(".ratings-show .rating");

  if(w.length == 1) {
    _(DATA["ratings/items"]).each(function(item, i) {
      
      var view = new ItemView({model: new ItemModel(item.item)});
      debugger;
      view.position = i + 1;
      view.rating_path = w.data("rating-url");
      w.append(view.render().$el);

    });
  }
})()
