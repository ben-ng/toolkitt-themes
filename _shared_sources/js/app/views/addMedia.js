Website.Views.AddMedia = BaseView.extend({
  initialize: function(options) {
    if(options.page) {
      this.page = options.page;
    }
    
    this.listenTo(this.page,'change',this.render,this);
  },
  events: {
    'click a.filepicker':'startFilepicker'
  },
  render: function() {
    var self = this;
    
    Website.loadTemplate(self, 'partials/addMedia', function() {
      self.$el.html(self.template(
        _.extend(_.clone(Website.userVars),{
          page: self.page.attributes
        })
      ));
      
      self.$('.tooltip-trigger').tooltip();
    });
    
    return self;
  },
  //Tries to delete the page
  startFilepicker: function(e, debug_cb) {
    if(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    this.page.addMedia(debug_cb);
  }
});