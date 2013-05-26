Website.Views.MediaGrid = BaseView.extend({
  initialize: function(options) {
    //Fetch the page
    if(options.page) {
      this.page = options.page;
    }
    
    this.listenTo(Website.pages,'change add remove',this.render,this);
  },
  render: function() {
    var self = this;
    
    var media = [];
    
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