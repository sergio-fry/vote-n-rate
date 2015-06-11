// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery_ujs
//= require_tree ./lib
//= require_tree ./templates
//= require_tree ./models
//= require_tree ./views
//= require_tree .

window.current_user = new UserModel({
  // пока не загрузились данные, показываем предыдущий аватар
  image: $.cookie("avatar"),
});

DisplayRating(current_user);

MazavrAuth("user_info", function(info) {
  current_user.set({ id: info.id, name: info.name, image: info.image, ip: info.ip });

  DisplayRating(current_user);

  $.cookie("avatar", info.image, { path: "/" });
  $.cookie("auth_crypted", info.crypted, { path: "/" });
})


new LoginWidgetView({ el: $(".login-widget"), model: current_user }).render();

$(function () {
  $('[data-toggle="popover"]').popover()
  $('[data-toggle="popover"][data-static="true"]').popover('show')
})
