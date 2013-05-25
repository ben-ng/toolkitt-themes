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
    
    if(options.success) {
      var proxiedSuccess = options.success;
      
      options.success = function(data, textStatus, jqXHR) {
        if(data.error) {
          if(options.error) {
            options.error(data.error, textStatus, jqXHR);
          }
        }
        else {
          return proxiedSuccess(data, textStatus, jqXHR);
        }
      }
    }

    return proxiedSync(method, model, options);
  };
})();