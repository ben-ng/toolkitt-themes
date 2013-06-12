Website.Views.EditMedia = BaseView.extend({
  initialize: function(options) {
    this.template = window.JST._editMedia;
    
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
    var attrs = _.clone(this.media.attributes);
    var ready = true;
    
    if(attrs.s3key) {
      attrs.url = Website.s3prefix + attrs.s3key;
    }
    else {
      attrs.thumbnailUrl = Website.placeholderThumbnail();
      ready = false;
    }
      
    if(attrs.thumbnailS3key) {
      attrs.thumbnailUrl = Website.s3prefix + attrs.thumbnailS3key;
    }
    else {
      //Halfsized with the true option
      attrs.thumbnailUrl = Website.placeholderThumbnail();
    }
    
    attrs.isImage = attrs.type === 'image';
    attrs.isVideo = attrs.type === 'video';
    
    this.$el.html(this.template(
      _.extend(_.clone(Website.userVars),{
        media: attrs
      })
    ));
    
    //Focus on name input if it's empty
    var inputElem = this.$('input[name=name]');
    if(inputElem.val().replace(/]w/, '') == '') {
      inputElem.val('').focus();
    }
    
    Holder.run();
    
    //Only show this guider once
    if(ready) {
      if($.cookie('guider_thumbnailImage')) {
        return false;
      }
      else {
        $.cookie('guider_thumbnailImage','true',{expires:99999});
        
        if(attrs.isImage) {
          Website.loadGuider("thumbnailImage");
        }
        else {
          Website.loadGuider("thumbnailImageCustom");
        }
        return true;
      }
    }
    
    return this;
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
            var ucedType = self.media.attributes.type.charAt(0).toUpperCase()
            ucedType += self.media.attributes.type.substr(1);
            
            Website.setFlash(ucedType +" Saved!", "success");
          },
          error: Website.handleError
        });
      },
      error: Website.handleError
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
          error: Website.handleError
        }); 
      },
      function(err) {
        Website.error(err);
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