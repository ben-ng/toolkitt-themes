Website.Views.Header = BaseView.extend({
  initialize: function(options) {
    this.template = window.JST._header;
    
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
    this.$el.html(this.template(_.extend(
      _.clone(Website.userVars), {
        pageTitle: this.title,
        flash: Website.flash && Website.flash.message,
        flashType: Website.flash && Website.flash.type
      }
    )));
    
    //Dim the flash view(s?)
    var flashes = this.$(".alert");
    flashes.each(function(index,elem) {
      //Fade to white
      $(elem).animate({backgroundColor:"#FFF"},1000);
    });
    
    this.assign(Website.navbarView, '#navbar');
  }
});