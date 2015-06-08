var UserModel = Backbone.Model.extend({
  logged_in: function() {
    return !!this.get("id");
  }
})
