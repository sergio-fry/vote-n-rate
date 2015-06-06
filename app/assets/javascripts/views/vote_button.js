var VoteButtonView = Backbone.View.extend({
  initialize: function() {

    this.can_edit = true;
  },

  events: {
    "mouseenter": "onHover",
    "mouseleave": "onHoverOut",
    "click": "onClick",
  },

  template: _.template("<a href='#' class='btn btn-xs btn-default btn-vote'><div class='vote-teaser'><%= text %></div><div class='rating'><%= rating %></div></a>"),
          

  render: function() {
    this.$el.html(this.template({text: this.already_voted() ? "отмена" :"голосовать", rating: this.model.get("rating")}));

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
      this.$el.find(".rating").addClass("hidden");
      this.$el.find(".vote-teaser").removeClass("hidden");
      this.$(".btn").addClass("btn-danger");
    } else {
      this.$el.find(".vote-teaser").addClass("hidden");
      this.$el.find(".rating").removeClass("hidden");
      this.$(".btn").addClass("btn-primary");
    }
  },

  onHoverOut: function() {
    if(this.already_voted()) {
      this.$el.find(".rating").removeClass("hidden");
      this.$el.find(".vote-teaser").addClass("hidden");
      this.$(".btn").removeClass("btn-danger");
    } else {
      this.$el.find(".rating").addClass("hidden");
      this.$el.find(".vote-teaser").removeClass("hidden");
      this.$(".btn").removeClass("btn-primary");
    }
  },
  already_voted: function() {
    return !!$.cookie(this.rating_path + "/" + this.model.id + "/voted");
  }
});

