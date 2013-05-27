Website.Views.EditPage = BaseView.extend({
  initialize: function(options) {
    if(options.page) {
      this.page = options.page;
    }
  },
  events: {
    'submit':'performSave',
    'click a.btn-danger':'performDelete'
  },
  render: function() {
    var self = this;
    
    Website.loadTemplate(self, 'partials/editPage', function() {
      self.$el.html(self.template(
        _.extend(_.clone(Website.userVars),{
          page: self.page.attributes
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
  //Tries to save the edited page
  performSave: function(e) {
    var self = this;
    
    e.preventDefault();
    
    var name = this.$('input[name=name]').val();
    
    this.page.save({
      userId:Website.user.attributes.id,
      name:name
    }, {
      success:function() {
        Website.navbarView.pages.fetch({
          success:function() {
            Website.Router.navigate('page/'+name,{trigger:true});
          },
          error:function(err) {
            alert(err);
          }
        });
      },
      error:function(err) {
        alert(err);
      }
    });
  },
  //Tries to delete the page
  performDelete: function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    var self = this;
    
    var proceed = confirm("Are you sure you want to delete "+self.page.attributes.name+"?");
    if(proceed) {
      self.page.destroy({
        success:function() {
          //Return to home
          Website.Router.navigate('',{trigger:true});
        },
        error:function(err) {
          alert(err);
        }
      });
    }
    else {
      //noop
      return false;
    }
  }
});