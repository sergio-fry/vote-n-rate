var NewItemFormView = Backbone.View.extend({
  initialize: function(options, custom_options) {
    this.rating_id = custom_options.rating_id;
  },

  events: {
    "submit": "onSubmit",
    "click .add-button": "onSubmit",

    "click .btn-show-extra-fields": "onShowMore",
  },

  render: function() {
    this.$el.html(JST["templates/new_item_form"]({
      rating_id: this.rating_id,
      id: Math.random(),
    }));

    return this;
  },

  onSubmit: function() {
    ga('send', 'event', 'item', 'create');

    var self = this
    var form = this.$("form");

    $.ajax( {
      url: form.attr("action"),
      type: 'POST',
      data: new FormData( form[0] ),
      processData: false,
      contentType: false
    } ).then(function(data) {
      if(!!data["error"]) {
        alert(data["error"]);
      } else {
        var item = new ItemModel(data);
        self.collection.push(item)
      }
    });

    this.$(":input").not("[type='submit']").val("");

    return false;
  },

  onShowMore: function() {
    var fields = this.$(".extra-fields");

    if(fields.hasClass("hidden")) {
      fields.removeClass("hidden").hide();
    }
    fields.slideToggle();

    return false
  },
})

