Website.Views.Footer = BaseView.extend({
  initialize: function(options) {
    //Rerender on login status change
    Website.loginView.model.on('change', this.render, this);
  },
  render: function() {  
    var self = this;
    Website.loadTemplate(this,'partials/footer',function(err) {
      self.$el.html(self.template(Website.userVars));
    });
    return self;
  }
});