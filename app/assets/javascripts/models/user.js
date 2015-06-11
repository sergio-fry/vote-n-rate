var UserModel = Backbone.Model.extend({
  logged_in: function() {
    return !!this.get("id");
  },

  identity: function() {
    return this.get("id") || this.get("ip");
  },
})
