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
    var self = this
      , attrs = this.media.templateVars()
      , waitFor = 2
      , videoDims = {}
      , player
      , afterVideoLoad = function(e) {
          waitFor--;
          
          //Metadata Loaded Callback
          if(e) {
            videoDims = {height:this.videoHeight, width:this.videoWidth};
          }
          
          if(waitFor === 0) {
            //Limit to 960x540
            if(videoDims.width>960) {
              videoDims.height = videoDims.height * (960 / videoDims.width);
              videoDims.width = 960;
            }
            
            player = vjs(Website.videoPlayerId);
            player.width(videoDims.width);
            player.height(videoDims.height);
            player.on("ended",function () {
              Website.trigger("videoEnded",self.media);
            });
            
            setTimeout(function () {
              player.play();
            }, 1000);
          }
        };
    
    this.$el.html(this.template(
      _.extend(_.clone(Website.userVars),{
        media:attrs
      })
    ));
    
    //Initialize VJS
    if(attrs.isVideo) {
      //Reset players object, otherwise it won't be initialized properly by VJS
      vjs.players = {};
      vjs(Website.videoPlayerId,{preload:true},afterVideoLoad);
      this.$el.find("video").on('loadedmetadata', afterVideoLoad);
    }
    
    Holder.run();
    
    return this;
  }
});