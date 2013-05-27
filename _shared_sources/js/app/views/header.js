Website.Views.Header = BaseView.extend({
  initialize: function(options) {
    if(options.title) {
      this.title = options.title;
    }
    else {
      this.title = '';
    }
  },
  render: function() {  
    var self = this;
    Website.loadTemplate(this,'partials/header',function(err) {
      self.$el.html(self.template(_.extend(
        _.clone(Website.userVars), {
          pageTitle: self.title
        }
      )));
      
      self.assign(Website.navbarView, '#navbar');
    });
    return self;
  }
});