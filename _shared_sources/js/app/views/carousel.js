Website.Views.Carousel = BaseView.extend({
  initialize: function(options) {
    //Fetch the page
    if(options.page) {
      this.page = options.page;
    }
    
    this.reelOpen = false;
    
    this.listenTo(this.page.media,'change add remove',this.render,this);
    this.page.media.fetch();
  },
  events: {
    'click a.bigClose':'exitPlayer',
    'click a.reelToggle':'toggleReel'
  },
  toggleReel: function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    this.reelOpen = !this.reelOpen;
    this.render();
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
      attrs.thumbnailUrl = Website.s3prefix + attrs.thumbnailS3key;
      attrs.isImage = attrs.type === 'image';
      attrs.isVideo = attrs.type === 'video';
      media.push(attrs);
    });
    
    Website.loadTemplate(self, 'partials/carousel', function() {
      self.$el.html(self.template(
        _.extend(_.clone(Website.userVars),{
          media:media,
          page:self.page.attributes
        })
      ));
      
      //Activate carousel
      self.$('.carousel').elastislide();
      
      //Hide carousel?
      if(self.reelOpen) {
        self.$('.sliderWrap').slideDown(400);
        self.$('.symbol').html('&or;');
      }
      else {
        self.$('.sliderWrap').slideUp(400);
        self.$('.symbol').html('&and;');
      }
    });
    
    return self;
  }
});