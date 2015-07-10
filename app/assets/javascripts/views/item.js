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
    this.$el.html(JST["templates/item"]({
      position: this.position,
      title: _.escape(this.model.get("title")),
      link: _.escape(this.model.get("link")),
      can_edit: this.can_edit,
    }));


    if(!!this.model.get("picture")) {
      this.$(".picture").css({ "background-image": "url('" + this.model.get("picture") + "')" });
    }

    if(!this.model.get("link")) {
      this.$(".link").remove();
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
      link: this.model.get("link"),
      picture: this.model.get("picture"),
    }));

    if(!!this.model.get("picture")) {
      this.$(".picture-preview").css({ "background-image": "url('" + this.model.get("picture") + "')" });
    }

    this.$(".input-title").focus();
  },

  onSave: function() {
    var form = this.$(".edit_form");

    this.model.set({
      title: form.find(".input-title").val(),
      link: form.find(".input-link").val(),
    })

    var self = this;

    $.ajax( {
      url: '/iframe/uploader/upload',
      type: 'POST',
      data: new FormData( form[0] ),
      processData: false,
      contentType: false
    } ).then(function(data) {
      if(!!data["error"]) {
        alert(data["error"]);
      } else {
        self.model.save({picture: data["picture"]});
      }
    });


    this.model.save();

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

  onPictureSelect: function() {
    if(!this.can_edit) return;

    var self = this;

    this.$(".picture form").submit(function(e) {
      $.ajax( {
        url: '/iframe/uploader/upload',
        type: 'POST',
        data: new FormData( this ),
        processData: false,
        contentType: false
      } ).then(function(data) {
        if(!!data["error"]) {
          alert(data["error"]);
        } else {
          self.model.save({picture: data["picture"]});
        }
      });

      e.preventDefault();
    }).submit();
  },

  showControls: function() {
    this.$(".controls").removeClass("hidden");
  },

  hideControls: function() {
    this.$(".controls").addClass("hidden");
  },
});

