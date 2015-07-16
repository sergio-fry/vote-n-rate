var ItemView = Backbone.View.extend({
  initialize: function(options, custom_options) {
    var self = this;
    this.can_edit = custom_options.can_edit;
    this.rating_id = custom_options.rating_id;

    this.model.on("change sync", function() {
      self.render();
    });
  },

  events: {
    "click .btn-destroy": "onDestroy",
    "click .btn-edit": "onEdit",
    "submit .edit_form": "onSave",
    "click .btn-cancel": "onCancelEdit",
    "click .btn-cancel": "onCancelEdit",
    "mouseenter": "showControls",
    "mouseleave": "hideControls",
  },

  render: function() {
    var template = !!this.model.get("text") ? JST["templates/item_with_text"] : JST["templates/item"];

    this.$el.html(template({
      position: this.position,
      title: _.escape(this.model.get("title")),
      picture: _.escape(this.model.get("picture")),
      link: _.escape(this.model.get("link")),
      text: _.escape(this.model.get("text")),
      can_edit: this.can_edit,
    }));


    if(!!this.model.get("picture")) {
      this.$(".picture").css({ "background-image": "url('" + this.model.get("picture") + "')" });
    }

    button = new VoteButtonView({el: this.$(".vote-area"), model: this.model})
    button.render();

    return this;
  },

  onEdit: function() {
    if(!this.can_edit) return;

    this.$el.html(JST["templates/item_edit"]({
      id: this.model.id,
      rating_id: this.rating_id,
      title: this.model.get("title"),
      text: this.model.get("text"),
      link: this.model.get("link"),
      picture: this.model.get("picture"),
    }));

    if(!!this.model.get("picture")) {
      this.$(".picture-preview").css({ "background-image": "url('" + this.model.get("picture") + "')" });
    }

    this.$(".input-title").focus();

    return false;
  },

  onSave: function() {
    var form = this.$(".edit_form");
    var self = this;

    $.ajax( {
      url: form.attr("action"),
      type: 'PUT',
      data: new FormData( form[0] ),
      processData: false,
      contentType: false
    } ).then(function(data) {
      if(!!data["error"]) {
        alert(data["error"]);
      } else {
        self.model.set(data);
      }
    });

    return false
  },

  onCancelEdit: function() {
    this.render();

    return false
  },

  onDestroy: function() {
    if(confirm("Действительно хотите удалить этот пункт?")) {
      var self = this;
      this.$el.fadeOut(function() {
        self.remove();
        self.model.destroy();
      })
    }

    return false
  },

  showControls: function() {
    this.$(".controls").removeClass("hidden");
  },

  hideControls: function() {
    this.$(".controls").addClass("hidden");
  },
});

