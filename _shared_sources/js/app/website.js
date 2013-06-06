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
  * Valid file extensions and other constants
  */
  /*videoExts: ['.mp4', '.flv', '.mkv', '.webm', '.wmv', '.mov', '.f4v', '.3gp', '.avi'],*/
  videoExts: ['.mp4', '.m4v', '.f4v', '.webm', '.ogv','.flv','.mov'],
  imageExts: ['.gif', '.png', '.jpeg', '.jpg', '.bmp'],
  thumbnailDims: {width:340,height:192},
  flashMessage:null,
  s3prefix:'http://toolkitt.s3.amazonaws.com/',
  placeholderThumbnail: function(halfSize) {
    var w = this.thumbnailDims.width;
    var h = this.thumbnailDims.height;
    
    if(halfSize) {
      w=Math.round(w/2);
      h=Math.round(h/2);
    }
    
    return 'http://holder.js/'+w+'x'+h+'/text:No Thumbnail';
  },
  /*
  * Utils
  */
  util: {
    isVideo:function(filename) {
      var ext = '.'+filename.split('.').pop();
      return Website.videoExts.indexOf(ext)>=0;
    },
    isImage:function(filename) {
      var ext = '.'+filename.split('.').pop();
      return Website.imageExts.indexOf(ext)>=0;
    }
  },
  /*
  * Handles links
  */
  events: {
    'click a.app':function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      var target = e.target;
      
      while(target.pathname == null) {
        target = target.parentElement;
      }
      
      this.Router.navigate(target.pathname, {trigger:true});
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
    
    //Configure filepicker.io
    filepicker.setKey(opts.filePickerKey);
    
    //Configure video.js
    vjs.options.flash.swf = "http://example.com/path/to/video-js.swf";
    
    //Our routes will call methods in this object
    this.Router = new Website.AppRouter({
      app: this
    });
    
    //These models/collections are the most important
    this.user = new Website.Models.User({id:opts.userId});
    this.pages = new Website.Collections.Pages();
    this.unprocessed = new Website.Collections.UnprocessedUploads();
    this.unprocessed.reset([]);
    
    //The page will have to be rendered if any of these change
    /*
    var forceUpdate = function() {
      var frag = Backbone.history.fragment;
      if(frag !== 'tests') {
        Backbone.history.fragment = null;
        Backbone.history.navigate(frag, true);
      }
    };
    
    this.listenTo(this.user,'change',forceUpdate,this);
    this.listenTo(this.pages,'change add remove',forceUpdate,this);
    this.listenTo(this.unprocessed,'change add remove',forceUpdate,this);
    */
    
    //Flash functions
    this.setFlash = function(message,type) {
      if(!type) {
        type='info';
      }
      self.flash = {message: message, type: type};
      self.render();
    };
    this.clearFlash = function() {
      self.flash=null;
      self.render();
    };
    
    var fetchesToMake = 3;
    var doneFetch = function() {
      fetchesToMake--;
      if(fetchesToMake===0) {
        //Update the isLoggedIn template variable
        Website.userVars = _.extend(Website.userVars,{
          isLoggedIn: self.isLoggedIn(),
          user: self.user.attributes
        });
        
        //Create essential views
        
        //The footer and login views are persistant across all pages
        self.loginView = new Website.Views.Login({
          user:self.user
        });
        self.headerView = new Website.Views.Header({title:'Loading'});
        self.navbarView = new Website.Views.Navbar({
          pages:self.pages,
          unprocessed:self.unprocessed
        });
        self.footerView = new Website.Views.Footer();
        
        //Start the app
        Backbone.history.start();
      }
    };
    
    //Fetch initial data
    this.pages.fetch({
      data:{userId:opts.userId},
      processData:true,
      success:doneFetch,
      error:self.error
    });
    this.unprocessed.fetch({success:doneFetch,error:self.error});
    this.user.fetch({success:doneFetch,error:self.error});
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
  },
  /*
  * Shows the index page
  */
  showIndex: function() {
    this.headerView.title = this.userVars.sitetitle.value;
    this.performAction('index',function() {
        this.assign(this.headerView, '#header');
        this.assign(this.footerView, '#footer');
    });
  },
  /*
  * Shows the login page
  */
  showLogin: function() {
    this.headerView.title = "Log In";
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
    this.headerView.title = "New Page";
    
    var pageform = new Website.Views.CreatePage();
    
    this.performAction('pageDetail',function() {
        this.assign(this.headerView, '#header');
        this.assign(pageform, '#pageform');
        this.assign(this.footerView, '#footer');
    });
  },
  /*
  * Shows the editPage page
  */
  showEditPage: function(name) {
    this.headerView.title = "Edit Page";
    
    //Find the page in the navbar collection
    name = decodeURIComponent(name);
    
    this.performAction('pageDetail',function() {
        var pages = Website.pages.where({name:name});
        var page;
        
        if(pages.length) {
          page = pages[0];
        }
        else {
          page = new Website.Models.Page({name:'Page not found'});
        }
        
        var pageform = new Website.Views.EditPage({
          page:page
        });
        
        this.assign(this.headerView, '#header');
        this.assign(pageform, '#pageform');
        this.assign(this.footerView, '#footer');
    });
  },
  /*
  * Shows the addMedia page
  */
  showAddMedia: function(name) {
    this.headerView.title = "Add Media";
    
    //Find the page in the navbar collection
    name = decodeURIComponent(name);
    
    this.performAction('pageDetail',function() {
        var pages = Website.pages.where({name:name});
        var page;
        
        if(pages.length) {
          page = pages[0];
        }
        else {
          page = new Website.Models.Page({name:'Page not found'});
        }
        
        var pageform = new Website.Views.AddMedia({
          page:page
        });
        
        this.assign(this.headerView, '#header');
        this.assign(pageform, '#pageform');
        this.assign(this.footerView, '#footer');
    });
  },
  /*
  * Shows the editMedia page
  */
  showEditMedia: function(type,id) {
    this.headerView.title = "Edit Media";
    
    //Find the page in the navbar collection
    id = decodeURIComponent(id);
    var media;
    
    if(type==='video') {
      media = new Website.Models.Video({id:id})
    }
    else {
      media = new Website.Models.Image({id:id})
    }
    
    var editForm = new Website.Views.EditMedia({
      media:media
    });
    
    var mediaPreview = new Website.Views.Media({
      media:media
    });
    
    this.performAction('editMedia',function() {
        this.assign(this.headerView, '#header');
        this.assign(editForm, '#editForm');
        this.assign(mediaPreview, '#preview');
        this.assign(this.footerView, '#footer');
    });
  },
  /*
  * Shows a page
  */
  showPage: function(name) {
    this.headerView.title = "Loading";
    
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
        
        this.headerView.title = page.attributes.name;
        
        this.assign(this.headerView, '#header');
        this.assign(mediagrid, '#mediagrid');
        this.assign(this.footerView, '#footer');
    });
  },
  /*
  * Shows the media page
  */
  showMedia: function(pageName,type,mediaId) {
    this.headerView.title = "Media Player";
    
    //Find the page in the navbar collection
    pageName = decodeURIComponent(pageName);
    type = decodeURIComponent(type);
    mediaId = decodeURIComponent(mediaId);
    var media;
    
    var pages = Website.pages.where({name:pageName});
    var page;
    
    if(pages.length) {
      page = pages[0];
    }
    else {
      page = new Website.Models.Page({name:'Page not found'});
    }
    
    if(type==='video') {
      media = new Website.Models.Video({id:mediaId})
    }
    else {
      media = new Website.Models.Image({id:mediaId})
    }
    
    var carouselView = new Website.Views.Carousel({
      page:page
    });
    
    var mediaPreview = new Website.Views.Media({
      media:media
    });
    
    media.fetch();
    
    this.performAction('mediaPlayer',function() {
        //Darken page
        $('body').addClass('dark');
        this.assign(carouselView, '#carouselWrapper');
        this.assign(mediaPreview, '#preview');
    });
  },
  /*
  * Shows the upload review page page
  */
  showReview: function(name) {
    var reviewList = new Website.Views.ReviewList({unprocessed:this.unprocessed});
    this.headerView.title = "Loading";
    
    this.performAction('review',function() {
        this.headerView.title = "Review Uploads";
        
        this.assign(this.headerView, '#header');
        this.assign(reviewList, '#reviewList');
        this.assign(this.footerView, '#footer');
    });
  },
  /*
  * Shows and runs the integration tests
  */
  showTests: function() {
    this.headerView.title = "Integration Tests";
    
    this.performAction('tests',function() {
      this.assign(this.headerView, '#header');
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
        //Whiten page
        $('body').removeClass('dark');
        
        cb.apply(self);
        self.$el.show();
        return this;
      }
      self.render();
    });
  },
  error: function(model, err) {
    console.log(model);
    console.log(err);
    var errToShow = err || model;
    var buff = "";
    
    if(errToShow == null) {
      errToShow = "Unknown (Null) Error";
    }
    
    if(typeof errToShow === 'object') {
      buff = [];
      
      for(var key in errToShow) {
        buff.push(key + ": " + errToShow[key]);
      }
      
      buff = buff.join(",");
    }
    else {
      buff += errToShow;
    }
    
    Website.setFlash("Error: "+buff,"error");
  },
  isLoggedIn: function() {
    return this.user.attributes.token ? true:false;
  }
}))({el:document.body});