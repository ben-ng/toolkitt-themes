Website.Views.CreatePage = BaseView.extend({
  initialize: function(options) {
    //Initialize an empty user
    this.model = new Website.Models.Page({name:''});
    
    this.listenTo(this.model,'invalid',function(model,err) {
      //Restore the previous state of the model
      model.fetch();
      Website.error(err);
    },this);
  },
  events: {
    'submit':'performSave'
  },
  render: function() {
    var self = this;
    
    Website.loadTemplate(self, 'partials/createPage', function() {
      self.$el.html(self.template(
        _.extend(_.clone(Website.userVars),{
          page: self.model.attributes
        })
      ));
      
      //Focus on name input if it's empty
      var inputElem = self.$('input[name=name]');
      if(inputElem.val().replace(/]w/, '') == '') {
        inputElem.val('').focus();
      }
    });
    
    return self;
  },
  //Tries to log the user in
  performSave: function(e) {
    var self = this;
    
    e.preventDefault();
    
    var name = this.$('input[name=name]').val();
    
    this.model.save({
      userId:Website.user.attributes.id,
      name:name
    }, {
      success:function() {
        Website.navbarView.pages.fetch({
          success:function() {
            Website.Router.navigate('page/'+name,{trigger:true});
          },
          error: Website.handleError
        });
      },
      error: Website.handleError
    });
  }
});