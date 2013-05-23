var Website = new (Backbone.View.extend({
  /*
  * App
  */
  Collections:{},
  Models:{},
  Views:{},
  /*
  * Called when starting the app
  */
  start: function(opts) {
    //Save the bootstrapped user_vars
    this.debug = opts.debug === true;
    this.userVars = opts.userVars;
    this.userId = opts.userId;
    this.baseURL = opts.baseURL;
    
    //Configure EJS
    EJS.config({cache:this.debug});
    
    //Helper function for loading templates
    this.loadTemplate = function(route) {
      return new EJS({url: '/templates/' + route});
    };
    
    //Load the index page
    this.template = this.loadTemplate('main/index');
    
    //Initial render
    this.render();
    
    //Run tests if in debug mode
    if(this.debug) {
      $.getScript('/js/tests.js');
    }
  },
  /*
  * Renders the app
  */
  render: function() {
    this.$el.empty().html(this.template.render({user_vars:this.userVars}));
  },
}))({el:document.getElementById("app")});