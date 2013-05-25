var _page_user;

module("Pages", {
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
  var pages = new Website.Collections.Pages();
  ok(pages != null);
});
asyncTest("Fetch: zero", 2, function() {
  var pages = new Website.Collections.Pages();
  pages.fetch({
    success:function(collection, response, options) {
      strictEqual(collection.length, 0, "Collection should be initially empty");
      start();
    },
    error:function(collection, response, options) {
      ok(false, "Failed to perform fetch");
      start();
    }
  });
});
asyncTest("Fetch: one", 4, function() {
  var pages = new Website.Collections.Pages();
  var page = new Website.Models.Page({
    name:'Test Page',
    items:[],
    userId:_page_user.get("id")
  });
  page.save(null,{
    success:function() {
      equal(page.attributes.errors, null, "Save errors: "+JSON.stringify(page.attributes.errors));
      
      pages.fetch({
        success:function(collection, response, options) {
          strictEqual(collection.length, 1, "Collection should have one page");
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
  var pages = new Website.Collections.Pages();
  var page = new Website.Models.Page({
    name:'Test Page',
    items:[],
    userId:_page_user.get("id")
  });
  var page2 = new Website.Models.Page({
    name:'Test Page 2',
    items:[],
    userId:_page_user.get("id")
  });
  page.save(null,{
    success:function() {
      equal(page.attributes.errors, null, "Save errors: "+JSON.stringify(page.attributes.errors));
      
      page2.save(null,{
        success:function() {
          equal(page2.attributes.errors, null, "Save errors: "+JSON.stringify(page2.attributes.errors));
          
          pages.fetch({
            success:function(collection, response, options) {
              strictEqual(collection.length, 2, "Collection should have two pages");
              //Destroy the page
              page.destroy({
                success:function(model,resp) {
                  ok(true);
                  //Destroy the page
                  page2.destroy({
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
});p