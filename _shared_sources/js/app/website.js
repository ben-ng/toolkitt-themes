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
    
    //These models are the most important
    this.user = new Website.Models.User({id:opts.userId});
    this.pages = new Website.Collections.Pages();
    this.pages.fetch({
      data:{userId:opts.userId},
      processData:true
    });
    
    //The footer and login views are persistant across all pages
    this.loginView = new Website.Views.Login({
      user:this.user
    });
    this.headerView = new Website.Views.Header();
    this.navbarView = new Website.Views.Navbar({
      pages:this.pages
    });
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
    this.performAction('index',function() {
        this.assign(this.headerView, '#header');
        this.assign(this.footerView, '#footer');
    });
  },
  /*
  * Shows the login page
  */
  showLogin: function() {
    this.performAction('login',function() {
        this.assign(this.headerView, '#header');
        this.assign(this.loginView, '#login');
        this.assign(this.footerView, '#footer');
    });
  },
  /*
  * Shows the logout page
  */
  showLogout: function() {
    //Log the user out
    var self = this;
    this.user.save({id:'logout',token:null},{
      success:function() {
        self.Router.navigate('login',{trigger:true});
      }
    });
  },
  /*
  * Shows the createPage page
  */
  showCreatePage: function() {
    var pageform = new Website.Views.CreatePage();
    
    this.performAction('createPage',function() {
        this.assign(this.headerView, '#header');
        this.assign(pageform, '#pageform');
        this.assign(this.footerView, '#footer');
    });
  },
  /*
  * Shows a page
  */
  showPage: function(name) {
    //Find the page in the navbar collection
    name = decodeURIComponent(name);
    
    this.performAction('page',function() {
        var pages = Website.pages.where({name:name});
        var page;
        
        if(pages.length) {
          page = pages[0];
        }
        else {
          page = new Website.Models.Page({name:'Page not found'});
        }
        
        var mediagrid = new Website.Views.MediaGrid({
          page:page
        });
        
        this.assign(this.headerView, '#header');
        this.assign(mediagrid, '#mediagrid');
        this.assign(this.footerView, '#footer');
    });
  },
  /*
  * Shows and runs the integration tests
  */
  showTests: function() {
    this.performAction('tests',function() {
      this.assign(this.footerView, '#footer');
      $.getScript('/js/tests.js');
    });
  },
  /*
  * Helper function
  */
  performAction: function(layout,cb) {
    var self = this;
    
    this.loadTemplate(this,'layouts/'+layout,function(err, template) {
      if(err) {
        alert(err);
      }
      
      self.render = function() {
        self.$el.html(template(self.userVars)).hide();
        cb.apply(self);
        self.$el.show();
        return this;
      }
      self.render();
    });
  }
}))({el:document.body});