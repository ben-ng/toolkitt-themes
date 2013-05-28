Website.Views.AddMedia = BaseView.extend({
  initialize: function(options) {
    if(options.page) {
      this.page = options.page;
    }
  },
  events: {
    'click a.filepicker':'startFilepicker'
  },
  render: function() {
    var self = this;
    
    Website.loadTemplate(self, 'partials/addMedia', function() {
      self.$el.html(self.template(
        _.extend(_.clone(Website.userVars),{
          page: self.page.attributes
        })
      ));
      
      self.$('.tooltip-trigger').tooltip();
    });
    
    return self;
  },
  //Tries to delete the page
  startFilepicker: function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    var self = this;
    filepicker.pickMultiple({
      extensions:Website.videoExts.concat(Website.imageExts),
      path:Website.user.attributes.path,
      signature:Website.user.attributes.signature,
      policy:Website.user.attributes.policy,
      services:[
        'COMPUTER',
        'DROPBOX',
        'FLICKR',
        'GOOGLE_DRIVE',
        'FTP',
        'VIDEO'
      ]
    },
    function(FPFile) {
      console.log("Store successful:", JSON.stringify(FPFile));
    },
    function(FPError) {
      console.log(FPError.toString());
    },
    function(progress) {
      console.log("Loading: "+progress+"%");
    });
  }
});