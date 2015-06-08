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
  },

  template_controls: _.template("<a href='#' class='destroy btn btn-danger btn-xs'>Удалить</a>"),

  render: function() {
    this.$el.html(JST["templates/item"]({
      position: this.position,
      title: this.model.get("title"),
    }));

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
  },

  // при сохранении происходит перерисовка виджета, потому происходит
  // blur поля, что приводит к дублированному сохранению. Потому
  // делаем ограничение на сохранения не чаще, чем через 100ms
  onSave: _.throttle(function() {
    this.model.save({ title: this.$(".edit_form :input").val() })

    return false
  }, 100),

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

