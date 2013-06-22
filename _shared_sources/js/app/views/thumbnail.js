Website.Views.Thumbnail = BaseView.extend({
  initialize: function(options) {
    this.template = window.JST._thumbnail;
    
    //Fetch the page
    if(options.media) {
      this.media = options.media;
    }
    
    this.listenTo(this.media,'change',this.render,this);
    this.listenTo(Website,'iframeResize', this.resizeIframe ,this);
    this.listenTo(Website,'thumbnailCaptured', this.saveThumbnail ,this);
    this.listenTo(Website,'captureThumbnail', this.captureThumbnail ,this);
  },
  render: function() {
    var attrs = this.media.templateVars()
      , opts = {
          media: {
            sources: [
              {
                src: attrs.url
              , type: Website.util.mime(attrs.mimeType)
              }
            ]
          , attributes: {
              id: "media_" + Website.util.uuid(10)
            , resize: true
            }
          }
        , dimensions: Website.thumbnailDims
        , domain: document.domain
        };
    
    this.$el.html(this.template(
      _.extend(_.clone(Website.userVars),{
        media: attrs
      , thumberUrl: attrs.s3key ? Website.thumberUrl + "#" + encodeURIComponent(JSON.stringify(opts)) : null
      })
    ));
    
    Website.messenger.targetFrame = this.$el.find("iframe")[0];
    
    return this;
  },
  resizeIframe: function (height) {
    this.$el.find("iframe").attr("height", parseInt(height)+60);
  },
  saveThumbnail: function (base64data) {
    Website.setFlash("Please Wait, Saving Image...","info");
  },
  captureThumbnail: function () {
    var self = this;
    
    //Send a message
    Website.messenger.send("capture",[],function (data) {
      self.media.useThumbnail(data.substring(data.indexOf(",")+1));
    });
  }
});