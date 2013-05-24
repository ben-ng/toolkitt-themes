Website.Views.Header = BaseView.extend({
  render: function() {  
    var self = this;
    Website.loadTemplate(this,'partials/header',function(err) {
      self.$el.html(self.template(Website.userVars));
    });
    return self;
  }
});