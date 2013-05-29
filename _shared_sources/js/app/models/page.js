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
    //Set the page media collection
    this.media = new Website.Collections.PageMedia({page:this});
    return data;
  },
  addMedia: function(debug_cb) {
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
      ],
      debug:debug_cb?true:false
    },
    function(FPFiles) {
      if(Object.prototype.toString.call( FPFiles ) !== '[object Array]') {
        FPFiles = [FPFiles]; //wrap in an array.
      }
      
      var newItems = _.clone(self.attributes.items);
      var itemsToGo = FPFiles.length;
      var afterItemCompete = function(new_id, new_name, type, after_save_cb) {
        newItems.push({ID:new_id,NAME:new_name,TYPE:"image",THUMB:"http://placehold.it/320x180"});
        itemsToGo--;
        if(itemsToGo===0) {
          self.set("items",newItems);
          self.save(null,{
            success:after_save_cb,
            error:function(err) {
              alert(err);
            }
          });
        }
      };
      
      for(var i=0, ii=FPFiles.length; i<ii; i++) {
        //Save the file to the server
        (function(FPFile) {
          var model;
          var type;
          var opts = {
            name: FPFile.filename,
            s3key: FPFile.url,
            mimeType: FPFile.mimeType,
            originalFilesize: FPFile.filesize,
            userId: self.attributes.userId,
            attribs: [],
            status: 0
          };
          
          if(Website.util.isVideo(FPFile.filename)) {
            model = new Website.Models.Video();
            type="video";
          }
          else if(Website.util.isImage(FPFile.filename)) {
            model = new Website.Models.Image();
            type="image";
          }
          
          model.set(opts);
          
          model.save(null,{
            success:function(savedModel, resp) {
              //Pass in a no-op callback if there was no debug callback given
              var after_cb;
              if(debug_cb) {
                after_cb = debug_cb;
              }
              else {
                after_cb=function(){};
              }
              afterItemCompete(savedModel.attributes.id, savedModel.attributes.name, type, after_cb);
            },
            error:function(err,resp) {
              alert(JSON.stringify(resp));
            }
          });
        })(FPFiles[i]);
      }
    },
    function(FPError) {
      console.log(FPError);
    });
  }
});