String.prototype.toHtmlEntities = function() {
  return this.replace(/./gm, function(s) {
    return "&#" + s.charCodeAt(0) + ";";
  });
};
