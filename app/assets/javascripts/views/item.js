var ItemView = Backbone.View.extend({
  initialize: function() {
    this.already_voted = !!this.$el.data("already-voted");
    this.rating = this.$el.data("rating");

    // TODO: проверка, может ли редактировать
    this.can_edit = true;

    this.render();

    var self = this;

    this.model.on("change sync", function() {
      self.render();
    });
  },

  events: {
    "click .destroy": "onDestroy",
    "click .title": "onEdit",
    "submit .edit_form": "onSave",
    "blur .edit_form :input": "onBlur",
  },

  template_controls: _.template("<a href'<%= url %>' class='destroy btn btn-danger btn-xs'>Удалить</a>"),

  render: function() {
    this.$el.html(JST["templates/item"]({
      position: this.position,
      title: this.model.get("title"),
    }));

    button = new VoteButtonView({el: this.$(".vote-area"), model: this.model})
    button.render();

    if(this.can_edit) {
      this.$(".controls").append(this.template_controls({ url: this.model.rating_path }));
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
  },

  onSave: function() {
    var self = this;

    self.model.save({ title: this.$(".edit_form :input").val() })

    return false
  },

  onBlur: function() {
    this.onSave()

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
  },
});

