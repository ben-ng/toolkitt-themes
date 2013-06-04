Website.Views.MediaGrid = BaseView.extend({
  initialize: function(options) {
    //Fetch the page
    if(options.page) {
      this.page = options.page;
    }
    
    this.listenTo(this.page.media,'change add remove',this.render,this);
    this.page.media.fetch();
  },
  render: function() {
    var self = this;
    
    var media = [];
    
    self.page.media.forEach(function(model) {
      var attrs = _.clone(model.attributes);
      attrs.url = Website.s3prefix + attrs.s3key;
      attrs.thumbnailUrl = Website.s3prefix + attrs.thumbnailS3key;
      attrs.isImage = attrs.type === 'image';
      attrs.isVideo = attrs.type === 'video';
      media.push(attrs);
    });
    
    Website.loadTemplate(self, 'partials/mediaGrid', function() {
      self.$el.html(self.template(
        _.extend(_.clone(Website.userVars),{
          media:media,
          page:self.page.attributes
        })
      ));
    });
    
    return self;
  }
});