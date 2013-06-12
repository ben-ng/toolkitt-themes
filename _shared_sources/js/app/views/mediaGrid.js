Website.Views.MediaGrid = BaseView.extend({
  initialize: function(options) {
    this.template = window.JST._mediaGrid;
    
    //Fetch the page
    if(options.page) {
      this.page = options.page;
      
      if(this.page.media) {
        this.listenTo(this.page.media,'change add remove',this.render,this);
        this.page.media.fetch();
      }
      else {
        this.page.media = new Website.Collections.PageMedia([], {
          page: this.page
        });
      }
    }
    else {
      this.page = new Website.Models.Page({
        name:'Page not found'
      });
      this.page.media = new Website.Collections.PageMedia([]);
    }
  },
  render: function() {
    var media = [];
    var safeName = encodeURIComponent(this.page.attributes.name);
    
    this.page.media.forEach(function(model) {
      var attrs = _.clone(model.attributes);
      attrs.url = Website.s3prefix + attrs.s3key;
      attrs.playerUrl = 'page/'+safeName+'/'+attrs.type+'/'+attrs.id;
      
      if(attrs.thumbnailS3key) {
        attrs.thumbnailUrl = Website.s3prefix + attrs.thumbnailS3key;
      }
      else {
        attrs.thumbnailUrl = Website.placeholderThumbnail();
      }
      
      attrs.isImage = attrs.type === 'image';
      attrs.isVideo = attrs.type === 'video';
      
      if(Website.isLoggedIn()) {
        attrs.editHref = '/media/'+attrs.type+'/'+attrs.id+'/edit';
      }
      
      media.push(attrs);
    });
    
    this.$el.html(this.template(
      _.extend(_.clone(Website.userVars),{
        media:media,
        page:this.page.attributes
      })
    ));
    
    //Create any placeholders
    Holder.run();
    
    //Set any guiders
    Website.loadGuider();
    
    return self;
  }
});