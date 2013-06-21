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
    var attrs = _.clone(this.media.attributes)
      , waitFor = 2
      , videoDims = {}
      , afterVideoLoad = function(e) {
          waitFor--;
          
          //Metadata Loaded Callback
          if(e) {
            videoDims = {height:this.videoHeight, width:this.videoWidth};
          }
          
          if(waitFor === 0) {
            vjs(Website.videoPlayerId).width(videoDims.width).height(videoDims.height);
          }
        };
    
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
        media:attrs
      })
    ));
    
    //Initialize VJS
    if(attrs.isVideo) {
      //Reset players object, otherwise it won't be initialized properly by VJS
      vjs.players = {};
      vjs(Website.videoPlayerId,{},afterVideoLoad);
      this.$el.find("video").on('loadedmetadata', afterVideoLoad);
    }
    
    Holder.run();
    
    return this;
  }
});