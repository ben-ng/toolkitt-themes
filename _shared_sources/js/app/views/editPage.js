Website.Views.EditPage = BaseView.extend({
  initialize: function(options) {
    this.template = window.JST._editPage;
    
    if(options.page) {
      this.page = options.page;
    }
    
    this.listenTo(this.page,'invalid',function(model,err) {
      //Restore the previous state of the model
      model.fetch();
      Website.error(err);
    },this);
    
    this.listenTo(this.page.media,'change add remove',this.render,this);
    this.page.media.fetch();
  },
  events: {
    'submit':'performSave',
    'click a.btn-danger':'performDelete'
  },
  render: function() {
    var self = this;
    
    var media = [];
    
    self.page.media.forEach(function(model) {
      var attrs = _.clone(model.attributes);
      attrs.url = Website.s3prefix + attrs.s3key;
      
      if(attrs.thumbnailS3key) {
        attrs.thumbnailUrl = Website.s3prefix + attrs.thumbnailS3key;
      }
      else {
        //Halfsized with the true option
        attrs.thumbnailUrl = Website.placeholderThumbnail();
      }
      
      attrs.isImage = attrs.type === 'image';
      attrs.isVideo = attrs.type === 'video';
      attrs.editHref = '/media/'+attrs.type+'/'+attrs.id+'/edit';
      media.push(attrs);
    });
    
    self.$el.html(self.template(
      _.extend(_.clone(Website.userVars),{
        page: self.page.attributes,
        media: media
      })
    ));
    
    //Focus on name input if it's empty
    var inputElem = self.$('input[name=name]');
    if(inputElem.val().replace(/]w/, '') == '') {
      inputElem.val('').focus();
    }
    
    self.$('.sortable').sortable().bind('sortupdate', function() {
      self.readSortOrder.apply(self,arguments);
    });
    
    Holder.run();
    
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
            Website.setFlash("Page saved!","success");
          },
          error: Website.handleError
        });
      },
      error: Website.handleError
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
        error: Website.handleError
      });
    }
    else {
      //noop
      return false;
    }
  },
  //Reads the sorting order of items on the page
  readSortOrder: function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    var self = this;
    
    var items = self.$('.sortable').children();
    var models = [];
    var pageItems = [];
    items.each(function(index,elem) {
      var fModel = self.page.media.get($(elem).attr("data-uuid"));
      models.push(fModel);
      pageItems.push({
        ID:fModel.attributes.id,
        NAME:fModel.attributes.name,
        TYPE:fModel.attributes.type,
        THUMB:fModel.attributes.thumbnailS3key
      });
    });
    
    self.page.media.reset(models);
    self.page.set("items",pageItems);
    self.page.save({},{
      success:function() {
        Website.setFlash("Page saved!","success");
      },
      error:Website.handleError
    });
  }
});