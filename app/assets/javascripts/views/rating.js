var RatingView = Backbone.View.extend({
  initialize: function(options) {
    this.model.on("change sync", _.bind(this.render, this));
  },

  events: {
    "click .rating-title": "onEdit",
    "submit .edit-form": "onSave",
    "blur .edit-form :input": "onSave",
  },


  render: function() {
    var self = this;


    this.$el.html(JST["templates/rating"]({
      title: this.model.get("title"),
    }));

  },

  onEdit: function() {
    if(!this.can_edit) return;

    var edit_form = $("<form class='edit-form form'>");
    var input = $("<input class='input form-control'>").val(this.model.get("title"));
    edit_form.append(input);

    this.$(".rating-title").replaceWith(edit_form);
    input.focus();
  },

  onSave:  _.throttle(function() {
    this.model.save({ title: this.$(".edit-form :input").val() });

    return false
  }, 100),
})

