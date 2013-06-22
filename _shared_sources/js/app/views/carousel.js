Website.Views.Carousel = BaseView.extend({
  initialize: function(options) {
    this.template = window.JST._carousel;
    
    //Fetch the page
    if(options.page) {
      this.page = options.page;
    }
    
    this.reelOpen = false;
    
    this.listenTo(this.page.media,'change add remove',this.render,this);
    this.listenTo(Website,'videoEnded',this.advance,this);
    this.page.media.fetch();
  },
  events: {
    'click a.bigClose':'exitPlayer',
    'click a.reelToggle':'toggleReel'
  },
  advance: function (lastMedia) {
    //Find the media element after lastMedia
    var self = this
      , lastElementWasMatch = false
      , matchedElement = null
      , playerUrl
      , safeName = encodeURIComponent(self.page.attributes.name);
    
    if(this.page && this.page.media) {
      this.page.media.each(function (media) {
        if(lastMedia.id === media.id) {
          lastElementWasMatch = true;
        }
        if(lastElementWasMatch) {
          matchedElement = media;
          return false;
        }
      });
      
      if(matchedElement) {
        playerUrl = 'page/'+safeName+'/'+matchedElement.attributes.type+'/'+matchedElement.id;
        
        Website.Router.navigate(playerUrl, {trigger:true});
      }
    }
  },
  toggleReel: function(e, toggle) {
    var self = this;
    
    if(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if(toggle !== false) {
      self.reelOpen = !self.reelOpen;
    }
    
    //Hide carousel?
    if(self.reelOpen) {
      self.$('.sliderWrap').slideDown(400);
      self.$('.symbol').html('&and;');
    }
    else {
      self.$('.sliderWrap').slideUp(400);
      self.$('.symbol').html('&or;');
    }
  },
  exitPlayer: function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    Backbone.history.navigate('page/'+this.page.attributes.name,{trigger:true});
  },
  render: function() {
    var self = this;
    
    var media = [];
    var safeName = encodeURIComponent(self.page.attributes.name);
    
    self.page.media.forEach(function(model) {
      var attrs = _.clone(model.attributes);
      attrs.url = Website.s3prefix + attrs.s3key;
      attrs.playerUrl = 'page/'+safeName+'/'+model.attributes.type+'/'+model.attributes.id;
      
      if(attrs.thumbnailS3key) {
        attrs.thumbnailUrl = Website.s3prefix + attrs.thumbnailS3key;
      }
      else {
        //Halfsized with the true option
        attrs.thumbnailUrl = Website.placeholderThumbnail(true);
      }
      
      if(Website.isLoggedIn()) {
        attrs.editHref = '/media/'+attrs.type+'/'+attrs.id+'/edit';
      }
      
      attrs.isImage = attrs.type === 'image';
      attrs.isVideo = attrs.type === 'video';
      media.push(attrs);
    });
    
    self.$el.html(self.template(
      _.extend(_.clone(Website.userVars),{
        media:media,
        page:self.page.attributes
      })
    ));
    
    //Activate carousel
    self.$('.carousel').elastislide();
    
    Holder.run();
    
    self.toggleReel(null,false);
    
    return self;
  }
});