Website.Views.AddMedia = BaseView.extend({
  initialize: function(options) {
    this.template = window.JST._addMedia;
    
    if(options.page) {
      this.page = options.page;
    }
    
    if(this.page.media) {
      this.listenTo(this.page.media,'change add remove',this.render,this);
      this.page.media.fetch();
    }
    
    this.listenTo(this.page,'change',this.render,this);
  },
  events: {
    'click a.filepicker':'startFilepicker'
  },
  render: function() {
    this.$el.html(this.template(
      _.extend(_.clone(Website.userVars),{
        page: this.page.attributes
      })
    ));
    
    self.$('.tooltip-trigger').tooltip();
    
    Website.loadGuider();
    
    return this;
  },
  //Tries to delete the page
  startFilepicker: function(e, debug_cb) {
    if(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    Website.hideGuiders();
    
    this.page.addMedia(function(err, FPFiles) {
      if(err && err.code!==101) {
        Website.error(err);
      }
      else if(FPFiles) {
        Website.setFlash(FPFiles.length + " files uploaded!","success");
      }
      Website.loadGuider();
    },debug_cb);
  }
});