Website.Models.Page = BaseModel.extend({
  urlRoot:TK.baseURL+'/pages',
  defaults: {
    name:'Untitled',
    items:[],
    userId:'',
    errors:null
  },
  sync: function(method, model, options) {
    if(method === 'create' || method === 'update') {
      //For the create method we should stringify the items before sending to the server
      model.set("itemList",JSON.stringify(model.get("items")));
    }
    Backbone.sync(method, model, options);
  },
  parse: function(data, options) {
    data = data.page;
    delete data.page;
    try {
      data.items = JSON.parse(data.itemList);
    }
    catch(e) {
      data.items = [];
    }
    finally {
      delete data.itemList;
    }
    return data;
  },
  addMedia: function(debug_cb) {
    var self = this;
    console.log("B");
    
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
      ],
      debug:debug_cb?true:false
    },
    function(FPFiles) {
    console.log("C");
    
      if(!Object.prototype.toString.call( FPFiles ) !== '[object Array]') {
        FPFiles = [FPFiles]; //wrap in an array.
      }
      
      var newItems = _.clone(self.attributes.items);
      var itemsToGo = FPFiles.length;
      var afterItemCompete = function(new_id, after_save_cb) {
        newItems.push(new_id);
        itemsToGo--;
        if(itemsToGo===0) {
          self.save({items:newItems},{
            success:after_save_cb,
            error:function(err) {
              alert(err);
            }
          });
        }
      };
      
      for(var i=0, ii=FPFiles.length; i<ii; i++) {
        //Save the file to the server
        var FPFile = FPFiles[i];
        var model;
        var opts = {
          name: FPFile.filename,
          s3key: FPFile.url,
          mimeType: FPFile.mimeType,
          originalFilesize: FPFile.filesize,
          userId: Website.user.attributes.id,
          attribs: [],
          status: 0
        };
        
        if(Website.util.isVideo(FPFile.filename)) {
          model = new Website.Models.Video(opts);
        }
        else if(Website.util.isImage(FPFile.filename)) {
          model = new Website.Models.Image(opts);
        }
        
        model.save(null,{
          success:function() {
            //Pass in a no-op callback if there was no debug callback given
            var after_cb;
            if(debug_cb) {
              after_cb = debug_cb;
            }
            else {
              after_cb=function(){};
            }
            afterItemCompete(model.attributes.id, after_cb);
          },
          error:function(err) {
            alert(err);
          }
        });
      }
    },
    function(FPError) {
      alert(FPError.toString());
    });
  }
});