Website.Views.MediaGrid = BaseView.extend({
  initialize: function(options) {
    //Fetch the page
    if(options.page) {
      this.page = options.page;
      
      if(this.page.media) {
        this.listenTo(this.page.media,'change add remove',this.render,this);
        this.page.media.fetch();
      }
      else {
        this.page.media = new Website.Collections.PageMedia({
          page: this.page
        });
      }
    }
    else {
      this.page = new Website.Models.Page({
        name:'Page not found'
      });
      this.page.media = new Website.Collections.PageMedia();
    }
  },
  render: function() {
    var self = this;
    
    var media = [];
    var safeName = encodeURIComponent(self.page.attributes.name);
    
    self.page.media.forEach(function(model) {
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
    
    Website.loadTemplate(self, 'partials/mediaGrid', function() {
      self.$el.html(self.template(
        _.extend(_.clone(Website.userVars),{
          media:media,
          page:self.page.attributes
        })
      ));
      
      //Create any placeholders
      Holder.run();
    });
    
    return self;
  }
});