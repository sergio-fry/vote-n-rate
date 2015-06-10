(function($) {
  var key = "rca.1.1.20150610T051700Z.e10a6faebad2b016.79e9b4f5a2851eda8c5a722219fbb2b1e6bc7391"

  var request = function(url, options) {
    options = options || {};

    var default_options = {
      key: key,
      url: url,
      content: "no",
    };

    return $.getJSON("http://rca.yandex.com/", $.extend(default_options, options))
  }

  window.YandexRCA = {}
  YandexRCA.request = request;
})(jQuery);
