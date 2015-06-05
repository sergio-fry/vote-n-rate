
var VoteButton = Backbone.View.extend({
  initialize: function() {
    this.already_voted = !!this.$el.data("already-voted");
    this.rating = this.$el.data("rating");

    this.render();
  },

  events: {
    "mouseenter": "onHover",
    "mouseleave": "onHoverOut",
  },

  template: _.template("<div class='vote-teaser'><%= text %></div><div class='rating'><%= rating %></div>"),

  render: function() {

    this.$el.html(this.template({text: this.already_voted ? "Отмена" :"Голосовать", rating: this.rating}));

    this.onHoverOut();

    if(this.already_voted) {
      this.$el.addClass("btn-success");
    }

    return this;

  },

  onHover: function() {
    if(this.already_voted) {
      this.$el.find(".rating").addClass("hidden");
      this.$el.find(".vote-teaser").removeClass("hidden");
      this.$el.addClass("btn-danger");
    } else {
      this.$el.find(".vote-teaser").addClass("hidden");
      this.$el.find(".rating").removeClass("hidden");
      this.$el.addClass("btn-primary");
    }
  },

  onHoverOut: function() {
    if(this.already_voted) {
      this.$el.find(".rating").removeClass("hidden");
      this.$el.find(".vote-teaser").addClass("hidden");
      this.$el.removeClass("btn-danger");
    } else {
      this.$el.find(".rating").addClass("hidden");
      this.$el.find(".vote-teaser").removeClass("hidden");
      this.$el.removeClass("btn-primary");
    }
  },

});

$(function() {
  $(".ratings-show .item .btn-vote").each(function() {
    new VoteButton({ el: $(this) });
  })
});
