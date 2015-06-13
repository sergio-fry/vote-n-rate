(function() {
  var DOMAIN = "localhost:3000";

  var Embed = {};

  var waitFor = function(obj, prop, func, self,  count) {
    if (obj[prop]) {
      func.apply(self);
    } else {
      count = count || 0;
      if (count < 1000) setTimeout(function() {
        waitFor(obj, prop, func, self, count + 1)
      }, 0);
    }
  }

  var attachScript = function(url, func) {
    setTimeout(function() {
      var newScript = document.createElement('script');
      newScript.type = 'text/javascript';
      newScript.src = url || w.fastXDM.helperUrl;
      newScript.async = 1;
      newScript.onload = func;
      waitFor(document, 'body', function() {
        document.getElementsByTagName('HEAD')[0].appendChild(newScript);
      });
    }, 0);
  }




  Embed.embed = function(rating_id, wrapper_id) {
    var wrapper = document.getElementById(wrapper_id);

    var iframe = document.createElement('iframe');
    iframe.src = "http://" + DOMAIN + "/ratings/" + rating_id + "?embed=iframe";
    iframe.width = "100%";
    iframe.frameBorder = 0;
    iframe.scrolling = "no";
    wrapper.appendChild(iframe);

    attachScript("http://" + DOMAIN + "/js/iframeResizer.min.js", function() {
      iFrameResize();
    });
  }

  vr.q.map(function(args) {
    var f = Array.prototype.shift.apply(args);
    Embed[f].apply(this, args);
  })

})();
