Website.Views.Login = BaseView.extend({
  initialize: function(options) {
    //Initialize an empty user
    this.model = new Website.Models.User();
    
    //Rerender on change
    this.model.on('change', this.render, this);
  },
  events: {
    'submit':'login'
  },
  render: function() {
    var self = this;
    
    Website.loadTemplate(self, 'partials/login', function() {
      //Update the isLoggedIn template variable
      _.extend(Website.userVars,{
        isLoggedIn: self.isLoggedIn(),
        user: self.model.attributes
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
    
    this.model.save({username:username,password:password});
  },
  isLoggedIn: function() {
    return this.model.attributes.token ? true:false;
  }
});