var _folder_user;

module("Folder", {
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
test("Initialize Folder", 2, function() {
  var folder = new Website.Models.Folder();
  ok(folder != null);
});
asyncTest("Save, Edit & Destroy Folder", 5, function() {
  var folder = new Website.Models.Folder({
    name:'Test Folder',
    items:[],
    userId:_folder_user.get("id")
  });
  folder.save(null,{
    success:function() {
      ok(folder.attributes.errors == null, "Save errors: "+JSON.stringify(folder.attributes.errors));
      
      //Perform an edit
      folder.set("name","Changed Test Folder");
      
      folder.save(null,{
        success:function() {
          ok(folder.attributes.errors == null, "Save errors: "+JSON.stringify(folder.attributes.errors));
          ok(folder.attributes.name === "Changed Test Folder","Changed folder name correctly");
          
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