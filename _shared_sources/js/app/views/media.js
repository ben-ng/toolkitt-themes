Website.Views.Media = BaseView.extend({
  initialize: function(options) {
    //Fetch the page
    if(options.media) {
      this.media = options.media;
    }
    
    this.listenTo(this.media,'change',this.render,this);
  },
  render: function() {
    var self = this;
    
    Website.loadTemplate(self, 'partials/media', function() {
      var attrs = _.clone(self.media.attributes);
      attrs.url = Website.s3prefix + attrs.s3key;
      attrs.thumbnailUrl = Website.s3prefix + attrs.thumbnailS3key;
      attrs.isImage = attrs.type === 'image';
      attrs.isVideo = attrs.type === 'video';
      
      self.$el.html(self.template(
        _.extend(_.clone(Website.userVars),{
          media:attrs,
        })
      ));
    });
    
    return self;
  }
});