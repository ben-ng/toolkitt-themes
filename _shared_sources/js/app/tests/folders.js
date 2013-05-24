var _folder_user;

module("Folders", {
  setup: function() {
    if(!_folder_user) {
      stop();
      
      _folder_user = new Website.Models.User({username:'test',password:'pass'});
      _folder_user.save(null,{
        success:function() {
          ok(_folder_user.attributes.token === 'faketoken');
          start();
        },
        error: function(err) {
          ok(false, err);
          start();
        }
      });
    }
    else {      
      //Dummy assert
      ok(true);
    }
  }
});
test("Initialize", 2, function() {
  var folders = new Website.Collections.Folders();
  ok(folders != null);
});
asyncTest("Fetch: zero", 2, function() {
  var folders = new Website.Collections.Folders();
  folders.fetch({
    success:function(collection, response, options) {
      ok(collection.length === 0, "Collection should be initially empty");
      start();
    },
    error:function(collection, response, options) {
      ok(false, "Failed to perform fetch");
      start();
    }
  });
});
asyncTest("Fetch: one", 4, function() {
  var folders = new Website.Collections.Folders();
  var folder = new Website.Models.Folder({
    name:'Test Folder',
    items:[],
    userId:_folder_user.get("id")
  });
  folder.save(null,{
    success:function() {
      ok(folder.attributes.errors == null, "Save errors: "+JSON.stringify(folder.attributes.errors));
      
      folders.fetch({
        success:function(collection, response, options) {
          ok(collection.length === 1, "Collection should have one folder");
          //Destroy the folder
          folder.destroy({
            success:function(model,resp) {
              ok(true);
              start();
            },
            error: function(err) {
              ok(false, err);
              start();
            }
          });
        },
        error:function(collection, response, options) {
          ok(false, "Failed to perform fetch");
          start();
        }
      });
    },
    error: function(err) {
      ok(false, err);
      start();
    }
  });
});
asyncTest("Fetch: two", 6, function() {
  var folders = new Website.Collections.Folders();
  var folder = new Website.Models.Folder({
    name:'Test Folder',
    items:[],
    userId:_folder_user.get("id")
  });
  var folder2 = new Website.Models.Folder({
    name:'Test Folder 2',
    items:[],
    userId:_folder_user.get("id")
  });
  folder.save(null,{
    success:function() {
      ok(folder.attributes.errors == null, "Save errors: "+JSON.stringify(folder.attributes.errors));
      
      folder2.save(null,{
        success:function() {
          ok(folder2.attributes.errors == null, "Save errors: "+JSON.stringify(folder2.attributes.errors));
          
          folders.fetch({
            success:function(collection, response, options) {
              ok(collection.length === 2, "Collection should have two folders");
              //Destroy the folder
              folder.destroy({
                success:function(model,resp) {
                  ok(true);
                  //Destroy the folder
                  folder2.destroy({
                    success:function(model,resp) {
                      ok(true);
                      start();
                    },
                    error: function(err) {
                      ok(false, err);
                      start();
                    }
                  });
                },
                error: function(err) {
                  ok(false, err);
                  start();
                }
              });
            },
            error:function(collection, response, options) {
              ok(false, "Failed to perform fetch");
              start();
            }
          });
        },
        error: function(err) {
          ok(false, err);
          start();
        }
      });
    },
    error: function(err) {
      ok(false, err);
      start();
    }
  });
});