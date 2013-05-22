$(function(){
  //Parse the bootstrapped vars if possible
  if(user_vars) {
    try {
      user_vars = JSON.parse(decodeURIComponent(user_vars));
    }
    catch(e) {
      //Do nothing
    }
  }
  
  //Start the app
  var Website = new (Backbone.View.extend({
    Collections:{},
    Models:{},
    Views:{},
    start: function(opts) {
      //Configure EJS
      EJS.config({cache:opts.cache===true});
    
      //Save the bootstrapped user_vars
      this.user_vars = opts.user_vars;
      
      //Helper function for loading templates
      this.loadTemplate = function(route) {
        return new EJS({url: '/js/app/views/' + route});
      };
      
      //Load the index page
      this.template = this.loadTemplate('main/index');
      
      //Initial render
      this.render();
    },
    
    render: function() {
      this.$el.empty().html(this.template.render({user_vars:this.user_vars}));
    },
  }))({el:document.getElementById("app")}).start({user_vars:user_vars});
});