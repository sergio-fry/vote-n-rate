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
    ga('send', 'event', 'item', 'create');

    var title = this.$(":input.title").val();
    var self = this;

    if(title.match(/^http/)) {
      YandexRCA.request(title).then(function(data) {
        self.collection.create({ title: data.title, picture: data.img[0], link: data.finalurl }, { wait: true })
      }, function() {
        self.collection.create({ title: title }, { wait: true })
      });
    } else {
      self.collection.create({ title: title }, { wait: true })
    }
    this.$(":input").val("");

    return false;
  },
})

