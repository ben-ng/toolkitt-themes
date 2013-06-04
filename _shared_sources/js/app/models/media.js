Website.Models.Media = BaseModel.extend({
  urlRoot:TK.baseURL+'/Media_is_an_abstract_class_do_not_use_it',
  defaults:{
    name: 'Untitled',
    s3key: null,
    fpkey: null,
    mimeType: null,
    originalFilesize: null,
    userId: null,
    thumbnailS3key: null,
    thumbnailFpkey: null,
    attribs: [],
    reviewIssue: null,
    status: 0
  },
  sync: function(method, model, options) {
    var self = this;
    
    if(method === 'create' || method === 'update') {
      //For the create method we should stringify the items before sending to the server
      model.set("userAttributes",JSON.stringify(model.get("attribs")));
    }
    
    var afterCheckingMedia = function() {
      //Now check the thumbnail
      if(!model.attributes.thumbnailS3key && model.attributes.thumbnailFpkey && model.attributes.debug !== true) {
        filepicker.stat(self.thumbnailFpfile(),
          {
            path:true,
            policy:Website.user.attributes.policy,
            signature:Website.user.attributes.signature
          },
          function(metadata) {
            model.set('thumbnailS3key',metadata.path);
            Backbone.sync(method, model, options);
          }
        );
      }
      else {
        Backbone.sync(method, model, options);
      }
    }
    
    //If the s3key is unknown, try and find it first
    if(!model.attributes.s3key && model.attributes.fpkey && model.attributes.debug !== true) {
      filepicker.stat(self.fpfile(),
        {
          path:true,
          policy:Website.user.attributes.policy,
          signature:Website.user.attributes.signature
        },
        function(metadata) {
          model.set('s3key',metadata.path);
          afterCheckingMedia();
        }
      );
    }
    else {
      afterCheckingMedia();
    }
  },
  destroy: function(options) {
    if(options.success) {
      var oldcb = options.success;
      options.success = function() {
        //Reload unprocessed files
        Website.unprocessed.fetch();
        
        if(oldcb) {
          oldcb();
        }
      };
    }
    Backbone.sync('delete',this,options);
  },
  parse: function(data, options) {
    if(data.image) {
      data = data.image;
      delete data.image;
    }
    if(data.video) {
      data = data.video;
      delete data.video;
    }
    try {
      data.attribs = JSON.parse(data.userAttributes);
    }
    catch(e) {
      data.attribs = [];
    }
    finally {
      delete data.userAttributes;
    }
    return data;
  },
  pickThumbnail: function() {
    var self = this;
    
    filepicker.pick({
      extensions:Website.imageExts,
      path:Website.user.attributes.path,
      signature:Website.user.attributes.signature,
      policy:Website.user.attributes.policy,
      services:[
        'COMPUTER',
        'DROPBOX',
        'FLICKR',
        'GOOGLE_DRIVE',
        'FTP',
        'URL',
        'IMAGE_SEARCH',
        'WEBCAM'
      ]
    },
    function(FPFile) {
      //Use post-processing to downsize the original image
      self.cropThumbnail(FPFile);
    },
    function(FPError) {
      console.log(FPError);
    });
  },
  cropThumbnail: function(FPFile) {
    var self = this;
    
    if(!FPFile) {
      FPFile = self.fpfile();
    }
  
    filepicker.convert(FPFile,
      //Convert options
      {
        signature:Website.user.attributes.signature,
        policy:Website.user.attributes.policy,
        width:Website.thumbnailDims.width,
        height:Website.thumbnailDims.height
      },
      //Store options
      {
        path:Website.user.attributes.path,
        location:'s3',
        access:'public'
      },
      function(FPFileThumb) {
        self.save({thumbnailFpkey:FPFileThumb.url},{
          success:function() {
            Website.unprocessed.fetch();
          },
          error: function(err) {
            console.log(err);
          }
        });
      },
      function(FPError) {
        console.log(FPError);
      }
    );
  },
  fpfile: function() {
    return {
      url:this.attributes.fpkey,
      filename:this.attributes.name,
      mimetype:this.attributes.mimeType,
      isWriteable:false,
      size:this.attributes.originalFilesize
    };
  },
  thumbnailFpfile: function() {
    return {
      url:this.attributes.thumbnailFpkey
    };
  }
});