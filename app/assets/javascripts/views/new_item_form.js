var NewItemFormView = Backbone.View.extend({
  initialize: function() {
  },

  events: {
    "click .add-button": "onSubmit",
    "submit form": "onSubmit",
  },

  render: function() {
    this.$el.html(JST["templates/new_item_form"]({}));

    return this;
  },

  onSubmit: function() {
    this.collection.create({ title: this.$(":input.title").val() }, { wait: true })
    this.$(":input").val("");

    return false;
  },
})

