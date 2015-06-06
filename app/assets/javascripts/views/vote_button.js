var VoteButtonView = Backbone.View.extend({
  initialize: function() {

    this.can_edit = true;
    var self = this;

    this.model.on("change", function() {
      self.render();
    });
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

    $.ajax(this.model.url() + "/vote", {
      method: "PUT",
    }).then(function(item){
      self.model.set("rating", item.rating);
    });
  },

  unvote: function() {
    var self = this;

    $.ajax(this.model.url() + "/unvote", {
      method: "PUT",
    }).then(function(item){
      self.model.set("rating", item.rating);
    });
  },

  onClick: function() {
    if(this.already_voted()) {
      this.unvote()
      $.cookie(this.model.url() + "/voted", null);
    } else {
      this.vote()
      $.cookie(this.model.url() + "/voted", true);
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
    return !!$.cookie(this.model.url() + "/voted");
  }
});

