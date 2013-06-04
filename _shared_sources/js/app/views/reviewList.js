Website.Views.ReviewList = BaseView.extend({
  initialize: function(options) {
    //Fetch the page
    if(options.unprocessed) {
      this.unprocessed = options.unprocessed;
    }
    
    this.listenTo(this.unprocessed,'change add remove',this.render,this);
  },
  render: function() {
    var self = this;
    
    var unprocessedAttrs = [];
    
    this.unprocessed.forEach(function(model) {
      var attrs = model.attributes;
      attrs.editHref = '/media/'+attrs.type+'/'+model.id+'/edit';
      unprocessedAttrs.push(attrs);
    });
    
    Website.loadTemplate(self, 'partials/reviewList', function() {
      self.$el.html(self.template(
        _.extend(_.clone(Website.userVars),{
          unprocessed:unprocessedAttrs
        })
      ));
    });
    
    return self;
  }
});