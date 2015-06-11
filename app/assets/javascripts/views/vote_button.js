var VoteButtonView = Backbone.View.extend({
  initialize: function() {

    this.can_edit = true;
    var self = this;

    this.model.on("change", function() {
      self.render();
    });
  },

  events: {
    "mouseenter .btn": "onHover",
    "mouseleave .btn": "onHoverOut",
    "click .btn": "onClick",
  },

  template: _.template("<a href='#' class='btn btn-xs btn-circle btn-vote'></a>"),
          

  render: function() {
    this.$el.html(this.template());

    this.onHoverOut();

    return this;
  },

  vote: function() {
    var self = this;

    ga('send', 'event', 'button', 'click', 'vote');

    $.ajax(this.model.url() + "/vote", {
      method: "PUT",
    }).then(function(item){
      self.model.set(item);
    });
  },

  unvote: function() {
    var self = this;

    ga('send', 'event', 'button', 'click', 'unvote');

    $.ajax(this.model.url() + "/unvote", {
      method: "PUT",
    }).then(function(item){
      self.model.set(item);
    });
  },

  onClick: function() {
    if(this.already_voted()) {
      this.unvote()
    } else {
      this.vote()
    }

    return false;
  },

  onHover: function() {
    if(this.already_voted()) {
      this.$(".btn").html("<i class='glyphicon glyphicon-minus'></i>").attr("title", "Забрать свой голос");
      this.$(".btn").addClass("btn-danger");
      this.$(".btn").removeClass("btn-success");
    } else {
      this.$(".btn").html("<i class='glyphicon glyphicon-arrow-up'></i>").attr("title", "Поддержать");
      this.$(".btn").addClass("btn-primary");
      this.$(".btn").removeClass("btn-default");
    }
  },

  onHoverOut: function() {
    if(this.model.get("rating") > 0) {
      this.$(".btn").text(this.model.get("rating"));
    } else {
      this.$(".btn").html("<i class='glyphicon glyphicon-arrow-up'></i>").attr("title", "Поддержать");
    }

    if(this.already_voted()) {
      this.$(".btn").removeClass("btn-danger");
      this.$(".btn").addClass("btn-success");
    } else {
      this.$(".btn").removeClass("btn-primary");
      this.$(".btn").addClass("btn-default");
    }
  },

  already_voted: function() {
    return (this.model.get("vote_identites") || []).indexOf(current_user.identity()) != -1;
  }
});

