var RatingView = Backbone.View.extend({
  initialize: function(options) {
    this.model.on("change sync", _.bind(this.render, this));
    this.edit_mode = false;
  },

  events: {
    "click .rendered": "onEdit",
    "submit .edit-form": "onSave",
    "reset .edit-form": "onReset",
    "mouseenter": "showControls",
    "mouseleave": "hideControls",
  },

  render: function() {
    var self = this;

    this.$el.html(JST["templates/rating"]({
      title: _.escape(this.model.get("title")),
      description: _.escape(this.model.get("description")).replace(/\n+/, "<br /><br />"),
      can_edit: this.can_edit,
    }));
  },

  onEdit: function() {
    if(!this.can_edit) return;

    this.$el.html(JST["templates/rating_edit_form"]({
      title: this.model.get("title"),
      description: this.model.get("description"),
    }));

    this.edit_mode = true;

    // TODO: focus
  },

  onSave:  function() {
    if(!this.edit_mode) return;

    this.model.save({
      title: this.$(".edit-form :input.title").val(),
      description: this.$(".edit-form :input.description").val(),
    });

    this.edit_mode = false;

    return false
  },

  onReset: function() {
    this.render();
  },


  showControls: function() {
    this.$(".controls").css({ opacity: 1 });
  },

  hideControls: function() {
    this.$(".controls").css({ opacity: 0 });
  },
})

