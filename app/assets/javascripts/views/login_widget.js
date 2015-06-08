var LoginWidgetView = Backbone.View.extend({
  events: {
    "click .btn-login": "onLogin",
    "click .btn-logout": "onLogout",
  },

  initialize: function() {
    var self = this;
    this.model.on("change", function() {
      self.render();
    });
  },

  render: function() {
    var html = $(JST["templates/login_widget"]({
      avatar: this.model.get("image"),
      name: this.model.get("name"),
    }));

    if(this.model.logged_in()) {
      html.find("ul").append('<li role="presentation" class="dropdown-header">'+this.model.get("name")+'</li>')
      html.find("ul").append("<li><a href='/ratings/new' class='btn-add-rating'>Создать свой рейтинг</a></li>")

      html.find("ul").append("<li class='divider'></li>")
    
      html.find("ul").append("<li><a href='#' class='btn-logout'>Выйти</a></li>")
      
    } else {
      html.find("ul").append("<li><a href='#' class='btn-login'>Войти</a></li>")
    }

    this.$el.html(html);

    return this;
  },

  onLogin: function() {
    MazavrAuth("sign_in");

    return false;
  },

  onLogout: function() {
    MazavrAuth("logout");

    return false;
  },
});

