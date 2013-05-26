Website.Views.Navbar = BaseView.extend({
  initialize: function(options) {
    if(options.pages) {
      this.pages = options.pages;
    }
    this.listenTo(this.pages, 'change add remove sort',this.render,this);
    this.listenTo(Website.user, 'change',this.render,this);
  },
  render: function() {  
    var self = this;
    
    var modelAttrs = [];
    
    this.pages.forEach(function(model) {
      modelAttrs.push(model.attributes);
    });
    
    
    Website.loadTemplate(this,'partials/navbar',function(err) {
      self.$el.html(self.template(
        _.extend(_.clone(Website.userVars),{
          pages:modelAttrs
        })
      ));
    });
    return self;
  }
});