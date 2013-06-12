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
  videoExts: ['.mp4', '.m4v', '.f4v', '.webm', '.ogv','.flv','.mov'],
  imageExts: ['.gif', '.png', '.jpeg', '.jpg', '.bmp'],
  thumbnailDims: {width:340,height:192},
  flashMessage:null,
  s3prefix:'http://toolkitt.s3.amazonaws.com/',
  /*
  * Creates a holder.js URL to use as a placeholder thumbnail
  */
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
  * Guider rules
  * The function should return true if the guider should be shown
  * Only the first matching guider will be shown
  */
  guiders: {
    'index': function(fragment) {
      return fragment === '' && Website.pages.length == 0;
    },
    'createPage': function(fragment) {
      return fragment === 'createPage' && Website.pages.length == 0;
    },
    'addMedia': function(fragment) {
      var pageName = fragment.split('/')[1];
      var page = Website.pages.findWhere({name:pageName});
      return fragment.match(/^page\/[^\/]+$/) && page && page.media && page.media.length === 0;
    },
    'uploadFile': function(fragment) {
      var pageName = fragment.split('/')[1];
      var page = Website.pages.findWhere({name:pageName});
      return fragment.match(/^page\/[^\/]+\/addMedia$/) && page && page.media && page.media.length === 0;
    },
    'reviewFile': function(fragment) {
      //Only show this guider once
      if($.cookie('guider_reviewFile')) {
        return false;
      }
      else if(fragment === 'review') {
        $.cookie('guider_reviewFile','true',{expires:99999});
        return true;
      }
      
      return false;
    },
    'thumbnailImage': function(fragment) {
      //Only show this OR the video guider once
      if($.cookie('guider_thumbnailImage')) {
        return false;
      }
      else if(fragment.match(/^media\/image\/[^\/]+\/edit$/)) {
        $.cookie('guider_thumbnailImage','true',{expires:99999});
        return true;
      }
      
      return false;
    },
    'thumbnailImageCustom': function(fragment) {
      //Only show this OR the image guider once
      if($.cookie('guider_thumbnailImage')) {
        return false;
      }
      else if(fragment.match(/^media\/video\/[^\/]+\/edit$/)) {
        $.cookie('guider_thumbnailImage','true',{expires:99999});
        return true;
      }
      
      return false;
    }
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
    },
    ucfirst:function(str) {
      var s = str.charAt(0).toUpperCase();
      return s + str.substr(1);
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
    
    //We want to update the unprocessed items when the user is logged in or out
    this.listenTo(this.user,"change",function() {
      this.unprocessed.fetch({success:doneFetch,error:self.handleError});
    },this);
    
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
      self.headerView.render();
      
      //Clear the flash on the next route change
      self.listenToOnce(self.Router,"route",function(route, router, params) {
        self.clearFlash();
      });
    };
    this.clearFlash = function() {
      self.flash=null;
      self.headerView.render();
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
    this.unprocessed.fetch({success:doneFetch,error:self.handleError});
    this.user.fetch({success:doneFetch,error:self.handleError});
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
    
    self.render = function() {
      self.$el.html(window.JST[layout](self.userVars)).hide();
      
      //Whiten page
      $('body').removeClass('dark');
      
      cb.apply(self);
      self.$el.show();
      
      self.loadGuider();
      
      return this;
    }
    self.render();
  },
  /*
  * Loads the correct guider
  */
  loadGuider: function() {
    //Don't do anything if not yet logged in
    if(!Website.isLoggedIn()) {
      return false;
    }
  
    var path = Backbone.history.fragment;
    var foundGuider = false;
    
    //Loop through guiders and find the matching one
    for(var guiderId in this.guiders) {
      if(this.guiders[guiderId](path)) {
        foundGuider = guiderId;
        break;
      }
    }
    
    if(foundGuider) {
      //Prevents the annoying flash
      if(guiders._currentGuiderID !== foundGuider) {
        this.hideGuiders();
      }
      guiders.show(foundGuider);
    }
    else {
      this.hideGuiders();
    }
  },
  hideGuiders: function() {
    guiders.hideAll();
  },
  error: function(err) {
    console.log(err);
    
    var errToShow = err;
    var buff = "";
    
    if(errToShow == null) {
      errToShow = "Unknown (Null) Error";
    }
    
    if(typeof errToShow === 'object') {
      buff = [];
      
      /*
      * Error arrays come in the format
      * [{attr:<String>,message:<String>}, ...]
      */
      if(errToShow instanceof Array) {
        for(var i=0, ii=errToShow.length; i<ii; i++) {
          buff.push(Website.util.ucfirst(errToShow[i].attr) 
                  + ": " 
                  + Website.util.ucfirst(errToShow[i].message));
        }
      }
      //Probably a filepicker error then
      else if(errToShow.toString) {
        buff = [errToShow.toString()];
      }
      /*
      * Error objects come in the format
      * {attr:<message String>, ...}
      */
      else {
        for(var key in errToShow) {
          buff.push(Website.util.ucfirst(key) 
                  + ": " 
                  + Website.util.ucfirst(errToShow[key]));
        }
      }
      
      buff = buff.join(",");
    }
    else {
      buff += errToShow;
    }
    
    Website.setFlash("Error: "+buff,"error");
  },
  handleError: function(model, xhr, options) {
    var errors = JSON.parse(xhr.responseText).errors;
    
    Website.error(errors);
  },
  isLoggedIn: function() {
    return this.user.attributes.token ? true:false;
  }
}))({el:document.getElementById("app")});