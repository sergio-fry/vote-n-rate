var VoteButtonView = Backbone.View.extend({
  initialize: function() {

    this.can_edit = true;
  },

  events: {
    "mouseenter": "onHover",
    "mouseleave": "onHoverOut",
    "click": "onClick",
  },

  template: _.template("<a href='#' class='btn btn-xs btn-primary btn-vote'><span class='vote-teaser'><i class='fa fa-arrow-circle-up'></i></span><span class='rating'><%= rating %></span></a>"),
          

  render: function() {
    this.$el.html(this.template({rating: this.model.get("rating")}));

    this.onHoverOut();

    return this;
  },

  vote: function() {
    var self = this;

    $.ajax(this.rating_path + "/items/" + this.model.id + "/vote", {
      method: "PUT",
    }).then(function(item){
      self.model.set("rating", item.item.rating);
      self.render();
    });
  },

  unvote: function() {
    var self = this;

    $.ajax(this.rating_path + "/items/" + this.model.id + "/unvote", {
      method: "PUT",
    }).then(function(item){
      self.model.set("rating", item.item.rating);
      self.render();
    });
  },

  onClick: function() {
    if(this.already_voted()) {
      this.unvote()
      $.cookie(this.rating_path + "/" + this.model.id + "/voted", null);
    } else {
      this.vote()
      $.cookie(this.rating_path + "/" + this.model.id + "/voted", true);
    }

    return false;
  },

  onHover: function() {
    if(this.already_voted()) {
      this.$(".btn").removeClass("btn-success");
      this.$(".btn").addClass("btn-danger");
    } else {
    }
  },

  onHoverOut: function() {
    if(this.already_voted()) {
      this.$(".btn").addClass("btn-success");
      this.$(".btn").removeClass("btn-danger");
    } else {
    }
  },
  already_voted: function() {
    return !!$.cookie(this.rating_path + "/" + this.model.id + "/voted");
  }
});

