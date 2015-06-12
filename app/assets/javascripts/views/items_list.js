var ItemsListView = Backbone.View.extend({
  initialize: function(options, custom_options) {
    var self = this;

    this.can_edit = custom_options.can_edit;
    this.rating_id = custom_options.rating_id;

    this.items = _.chain(this.collection.models).sortBy(function(m) {
      return (m.get("title") || "").toLowerCase();
    }).sortBy(function(m) {
      return -m.get("rating");
    }).map(function(m) {
      var view = new ItemView({model: m}, { can_edit: self.can_edit, rating_id:  self.rating_id });

      return view
    }).each(function(el, i) {
      el.position = i + 1;
    }).value();


    this.collection.on("add", function(model) { self.add_item(model) });
    this.collection.on("change", function() { self.update_order_animated(); });
    this.collection.on("remove", function(model) { self.remove_item(model) });
  },

  events: {
  },

  remove_item: function(model) {
    this.items = _(this.items).reject(function(el) {
      return el.model == model;
    });

    this.update_order()
  },

  add_item: function(model) {
    var view = new ItemView({model: model}, { can_edit: this.can_edit, rating_id: this.rating_id });

    view.position = (_(this.items).sortBy(function(it) { return -it.position })[0] || {position: 0}).position + 1;

    this.items.push(view);

    this.$el.append(view.render().$el);

  },

  update_order: function() {
    var buf = $("<div>");
    var self = this;

    this.items.map(function(el, i) {
      el.position = i + 1;
      el.render()
      buf.append(el.$el);
    });

    this.$el.empty().append(buf);
  },



  update_order_animated: function() {
    var self = this;


    var sort_one = _.bind(function() {
      for(var i=0; i<(this.items.length-1); i++) {
        if(!this._check_order(this.items[i], this.items[i+1])) {
          this.lift_up_item(i + 1);

          return true;
        }
      }

      return false;
    }, this);

    var repeat_sorting;
    
    repeat_sorting = function() {
      if(sort_one()) {
        self.$(":animated").promise().done(function() {
          repeat_sorting();
        });
      };
    }

    repeat_sorting();

    this.update_order();
  },

  _check_order: function(item_a, item_b) {
    if (item_a.model.get("rating") > item_b.model.get("rating")) {
      return true;
    } else if (item_a.model.get("rating") < item_b.model.get("rating")) {
      return false
    } else if ((item_a.model.get("title") || "").toLowerCase() > (item_b.model.get("title") || "").toLowerCase()) {
      return false
    }

    return true
  },

  lift_up_item: function(i){
    var a = i - 1, b = i;

    if(b <= 0) return;

    var self = this;

    var item_1 = this.items[a];
    var item_2 = this.items[b];

    var el_1 = item_1.$el;
    var el_2 = item_2.$el;

    var position_1 = el_1.position();
    var position_2 = el_2.position();

    el_1.css({position: "relative" }).animate({top: position_2.top - position_1.top }, 200, "linear") 

    el_2.css({position: "relative" }).animate({top: position_1.top - position_2.top }, 200, "linear")

    this.$(":animated").promise().done(function() {
      self.items[a] = item_2;
      self.items[b] = item_1;

      var item_1_position = item_1.position;
      item_1.position = item_2.position;
      item_2.position = item_1_position;

      el_1.css({ position: "static", top: 0 });
      el_2.css({ position: "static", top: 0 });

      self.render();
    });

    return this.$(":animated").promise();
  },

  render: function() {
    var self = this;

    var buf = $("<div>");

    _(this.items).each(function(item, i) {
      buf.append(item.render().$el);
    })

    this.$el.empty().append(buf);
  },

  onEdit: function() {
    if(!this.can_edit) return;

    var edit_form = $("<form class='rating-title-edit-form form'>");
    var input = $("<input class='input form-control'>").val(this.model.get("title"));
    edit_form.append(input);

    this.$(".rating-title").replaceWith(edit_form);
    input.focus();
  },

  onSave: function() {

    this.model.save({ title: this.$(".rating-title-edit-form :input").val() })

    return false
  },
})

