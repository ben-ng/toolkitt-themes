(function() {

  var proxiedSync = Backbone.sync;

  Backbone.sync = function(method, model, options) {
    options || (options = {});
    
    if (model.methodUrl) {
      options.url = model.methodUrl(method.toLowerCase());
    }
    
    if (!options.crossDomain) {
      options.crossDomain = true;
    }

    if (!options.xhrFields) {
      options.xhrFields = {withCredentials:true};
    }

    return proxiedSync(method, model, options);
  };
})();