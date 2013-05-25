var Website = new (BaseView.extend({
  /*
  * App
  */
  Collections:{},
  Models:{},
  Views:{},
  /*
  * Holds template vars
  */
  userVars:{},
  /*
  * Handles links
  */
  events: {
    'click a':function(e) {
      e.preventDefault();
      this.Router.navigate(e.target.pathname, {trigger:true});
    }
  },
  /*
  * Called when starting the app
  */
  start: function(opts) {
    var self = this;
    
    //Save the bootstrapped user_vars
    this.debug = opts.debug === true;
    this.userVars = _.extend(opts.userVars,{debug:opts.debug});
    this.userId = opts.userId;
    this.baseURL = opts.baseURL;
    
    //Our routes will call methods in this object
    this.Router = new Website.AppRouter({
      app: this
    });
    
    //The footer and login views are persistant across all pages
    this.loginView = new Website.Views.Login();
    this.headerView = new Website.Views.Header();
    this.footerView = new Website.Views.Footer();
    
    //Track history
    Backbone.history.start();
  },
  /*
  * Helper function, loads templates
  */
  loadTemplate:function(obj, route,cb ) {
    $.ajax({
        url: '/templates/' + route + '.hbs',
        cache: false,
        success: function(data) {
            source    = data;
            obj.template  = Handlebars.compile(source);
            
            if(cb) {
              cb(null,obj.template);
            }
        }
    });
  },
  /*
  * This function will be overwritten by the show____ functions
  */
  render: function() {
    this.showIndex();
  },
  /*
  * Shows the index page
  */
  showIndex: function() {
    var self = this;
    this.loadTemplate(self,'layouts/index',function(err) {
      if(err) {
        alert(err);
      }
      
      self.render = function() {
        self.$el.html(template(self.userVars));
        
        self.assign(self.headerView, '#header');
        self.assign(self.footerView, '#footer');
      }
    });
    return this;
  },
  /*
  * Shows the login page
  */
  showLogin: function() {
    var self = this;
    this.loadTemplate(this,'layouts/login',function(err) {
      if(err) {
        alert(err);
      }
      
      self.render = function() {
        self.$el.html(template(self.userVars));
        
        self.assign(self.headerView, '#header');
        self.assign(self.loginView, '#login');
        self.assign(self.footerView, '#footer');
      }
    });
  },
  /*
  * Shows the logout page
  */
  showLogout: function() {
    //Log the user out
    var self = this;
    this.loginView.model.save({id:'logout',token:null},{
      success:function() {
        self.Router.navigate('login',{trigger:true});
      }
    });
  },
  showTests: function() {
    var self = this;
    this.loadTemplate(this,'layouts/tests',function(err) {
      if(err) {
        alert(err);
      }
      
      self.render = function() {
        self.$el.html(template(self.userVars));
        self.assign(self.footerView, '#footer');
        $.getScript('/js/tests.js');
      }
    });
  }
}))({el:document.body});