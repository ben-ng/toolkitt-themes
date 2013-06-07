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
        if(data[model.name] && data[model.name].errors) {
          if(options.error) {
            var sendToErrorhandler = function() {
              options.error({responseText:JSON.stringify({errors:data[model.name].errors})});
            };
            
            //If there was an error, we need to restore the last known "good" state of the model
            
            //Avoid going into an infinite loop if read produces an error
            if(method !== "read") {
              model.fetch({
                success: function() {
                  sendToErrorhandler();
                },
                error: function() {
                  sendToErrorhandler();
                }
              });
            }
            else {
              sendToErrorhandler();
            }
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