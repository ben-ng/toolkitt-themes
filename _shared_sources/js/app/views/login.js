Website.Views.Login = BaseView.extend({
  initialize: function(options) {
    if(options.user) {
      this.user = options.user;
    }
    
    //Rerender on change
    this.listenTo(this.user, 'change', this.render, this);
    
    //Fetch the current state
    this.user.fetch();
  },
  events: {
    'submit':'login'
  },
  render: function() {
    var self = this;
    
    Website.loadTemplate(self, 'partials/login', function() {
      //Update the isLoggedIn template variable
      Website.userVars = _.extend(Website.userVars,{
        isLoggedIn: Website.isLoggedIn(),
        user: self.user.attributes
      });
      
      self.$el.html(self.template(Website.userVars));
    });
    
    return self;
  },
  //Tries to log the user in
  login: function(e) {
    e.preventDefault();
    
    var username = this.$('input[name=username]').val();
    var password = this.$('input[name=password]').val();
    
    this.user.save({username:username,password:password});
  }
});