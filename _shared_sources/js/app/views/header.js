Website.Views.Header = BaseView.extend({
  initialize: function(options) {
    if(options.title) {
      this.title = options.title;
    }
    else {
      this.title = '';
    }
    if(options.flash) {
      this.flash = options.flash;
    }
  },
  events: {
    'click .close':'clearFlash'
  },
  clearFlash: function() {
    Website.clearFlash();
    this.render();
  },
  render: function() {  
    var self = this;
    Website.loadTemplate(this,'partials/header',function(err) {
      self.$el.html(self.template(_.extend(
        _.clone(Website.userVars), {
          pageTitle: self.title,
          flash: Website.flash && Website.flash.message,
          flashType: Website.flash && Website.flash.type
        }
      )));
      
      //Dim the flash view(s?)
      var flashes = self.$(".alert");
      flashes.each(function(index,elem) {
        //Fade to white
        $(elem).animate({backgroundColor:"#FFF",1000);
      });
      
      self.assign(Website.navbarView, '#navbar');
    });
    return self;
  }
});