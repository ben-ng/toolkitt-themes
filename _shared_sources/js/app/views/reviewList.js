Website.Views.ReviewList = BaseView.extend({
  initialize: function(options) {
    this.template = window.JST._reviewList;
    
    //Fetch the page
    if(options.unprocessed) {
      this.unprocessed = options.unprocessed;
    }
    
    this.listenTo(this.unprocessed,'change add remove',this.render,this);
  },
  render: function() {
    var unprocessedAttrs = [];
    
    this.unprocessed.forEach(function(model) {
      var attrs = model.attributes;
      attrs.editHref = '/media/'+attrs.type+'/'+model.id+'/edit';
      unprocessedAttrs.push(attrs);
    });
    
    this.$el.html(this.template(
      _.extend(_.clone(Website.userVars),{
        unprocessed:unprocessedAttrs
      })
    ));
    
    return this;
  }
});