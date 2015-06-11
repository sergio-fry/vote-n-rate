var ItemView = Backbone.View.extend({
  initialize: function() {
    this.already_voted = !!this.$el.data("already-voted");
    this.rating = this.$el.data("rating");

    var self = this;

    this.model.on("change sync", function() {
      self.render();
    });
  },

  events: {
    "click .destroy": "onDestroy",
    "click .title": "onEdit",
    "submit .edit_form": "onSave",
    "blur .edit_form :input": "onSave",

    "mouseenter .picture": "onHoverPicture",
    "mouseleave .picture": "onHoverOutPicture",

    "change .picture form :input.picture_file": "onPictureSelect",
  },

  template_controls: _.template("<a href='#' class='destroy btn btn-danger btn-xs'>Удалить</a>"),

  render: function() {
    this.$el.html(JST["templates/item"]({
      position: this.position,
      title: _.escape(this.model.get("title")),
      link: _.escape(this.model.get("link")),
      can_edit: this.can_edit,
    }));


    if(!!this.model.get("picture")) {
      this.$(".picture").css({ "background-image": "url('" + this.model.get("picture") + "')" });
    } else {
      if(!this.can_edit) {
        this.$(".picture-lg").remove();
      }
    }

    if(!this.model.get("link")) {
      this.$(".link").remove();
    }

    button = new VoteButtonView({el: this.$(".vote-area"), model: this.model})
    button.render();

    if(this.can_edit) {
      this.$(".controls").append(this.template_controls());
    }
    
    return this;
  },

  onEdit: function() {
    if(!this.can_edit) return;

    var edit_form = $("<form class='edit_form form'>");
    var input = $("<input class='input form-control'>").val(this.model.get("title"));
    edit_form.append(input);

    this.$(".title").replaceWith(edit_form);
    this.$(".controls").remove();
    input.focus();
    this.edit_mode = true;
  },

  // при сохранении происходит перерисовка виджета, потому происходит
  // blur поля, что приводит к дублированному сохранению. Потому
  // делаем ограничение на сохранения не чаще, чем через 100ms
  onSave: function() {
    if(!this.edit_mode) return;

    this.model.set({ title: this.$(".edit_form :input").val() })
    this.model.save();

    this.edit_mode = false;

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

  onHoverPicture: function() {
    if(!this.can_edit) return;

    // TODO: set owner
    var form = $('<form  enctype="multipart/form-data" action="/iframe/uploader/upload" accept-charset="UTF-8" method="post"><label for="picture_'+this.model.id+'"><div class="picture_upload_label text-center">Фото</div></label><input id="picture_'+this.model.id+'" type="file" class="picture_file hidden" name="file" ><input type="hidden" name="owner" value="'+this.rating_id+"/"+this.model.id+'" /></form>');

    this.$(".picture:visible").html(form);
  },

  onHoverOutPicture: function() {
    if(!this.can_edit) return;

    this.$(".picture form").remove();
  },

  onPictureSelect: function() {
    if(!this.can_edit) return;

    var self = this;

    this.$(".picture form:visible").submit(function(e) {
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
});

