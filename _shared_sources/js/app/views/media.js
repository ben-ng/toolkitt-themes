Website.Views.Media = BaseView.extend({
  initialize: function(options) {
    this.template = window.JST._media;
    
    //Fetch the page
    if(options.media) {
      this.media = options.media;
    }
    
    this.listenTo(this.media,'change',this.render,this);
  },
  render: function() {
    var attrs = _.clone(this.media.attributes);
    
    if(attrs.s3key) {
      attrs.url = Website.s3prefix + attrs.s3key;
    }
    else {
      attrs.thumbnailUrl = Website.placeholderThumbnail();
    }
      
    if(attrs.thumbnailS3key) {
      attrs.thumbnailUrl = Website.s3prefix + attrs.thumbnailS3key;
    }
    else {
      //Halfsized with the true option
      attrs.thumbnailUrl = Website.placeholderThumbnail();
    }
    
    attrs.isImage = attrs.type === 'image';
    attrs.isVideo = attrs.type === 'video';
    
    this.$el.html(this.template(
      _.extend(_.clone(Website.userVars),{
        media:attrs,
      })
    ));
    
    return this;
  }
});