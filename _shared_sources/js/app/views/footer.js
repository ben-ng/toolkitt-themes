Website.Views.Footer = BaseView.extend({
  initialize: function(options) {
    this.template = window.JST._footer;
    
    //Rerender on login status change
    this.listenTo(Website.user, 'change', this.render, this);
  },
  render: function() {
    this.$el.html(this.template(Website.userVars));
  }
});