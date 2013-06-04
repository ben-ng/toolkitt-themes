Website.Views.EditMedia = BaseView.extend({
  initialize: function(options) {
    if(options.media) {
      this.media = options.media;
    }
    
    this.listenTo(this.media,'change',this.render,this);
    
    this.media.fetch();
  },
  events: {
    'submit':'performSave',
    'click a.btn-danger':'performDelete',
    'click a.upload':'performPick',
    'click a.crop':'performCrop'
  },
  render: function() {
    var self = this;
    var attrs = _.clone(self.media.attributes);
    attrs.url = Website.s3prefix + attrs.s3key;
    attrs.thumbnailUrl = Website.s3prefix + attrs.thumbnailS3key;
    attrs.isImage = attrs.type === 'image';
    attrs.isVideo = attrs.type === 'video';
    
    Website.loadTemplate(self, 'partials/editMedia', function() {
      self.$el.html(self.template(
        _.extend(_.clone(Website.userVars),{
          media: attrs
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
  //Tries to save the edited media
  performSave: function(e) {
    var self = this;
    
    e.preventDefault();
    
    var name = this.$('input[name=name]').val();
    
    this.media.save({
      userId:Website.user.attributes.id,
      name:name
    }, {
      success:function() {
        Website.unprocessed.fetch({
          success:function() {
            Website.setFlash("Saved!","success");
          },
          error:function(err) {
            Website.setFlash("Error: "+err,"error");
          }
        });
      },
      error:function(err) {
        alert(err);
      }
    });
  },
  //Tries to delete the media
  performDelete: function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    var self = this;
    
    var proceed = confirm("Are you sure you want to delete "+self.media.attributes.name+"?");
    if(proceed) {
      filepicker.remove(self.media.fpfile(), {
        policy:Website.user.attributes.policy,
        signature:Website.user.attributes.signature
      }, function() {
        self.media.destroy({
          success:function() {
            //Return to home
            Website.Router.navigate('',{trigger:true});
          },
          error:function(err) {
            alert(err);
          }
        }); 
      },
      function(err) {
        console.log(err);
      });
    }
    else {
      //noop
      return false;
    }
  },
  //Tries to pick a new thumbnail
  performPick: function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    this.media.pickThumbnail();
  },
  //Tries to pick a new thumbnail
  performCrop: function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    this.media.cropThumbnail();
  }
});