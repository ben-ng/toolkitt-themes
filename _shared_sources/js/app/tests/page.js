var _page_user;

module("Page", {
  setup: function() {
    if(!_page_user) {
      stop();
      _page_user = new Website.Models.User({username:'test',password:'passpass'});
      _page_user.save(null,{
        success:function() {
          notEqual(_page_user.attributes.token, false);
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
  var page = new Website.Models.Page();
  ok(page != null);
});
asyncTest("Save, Update & Delete", 5, function() {
  var page = new Website.Models.Page({
    name:'Test Page',
    items:[],
    userId:_page_user.get("id")
  });
  page.save(null,{
    success:function() {
      ok(page.attributes.errors == null, "Save errors: "+JSON.stringify(page.attributes.errors));
      
      //Perform an edit
      page.set("name","Changed Test Page");
      
      page.save(null,{
        success:function() {
          ok(page.attributes.errors == null, "Save errors: "+JSON.stringify(page.attributes.errors));
          ok(page.attributes.name === "Changed Test Page","Changed page name correctly");
          
          //Destroy the page
          page.destroy({
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