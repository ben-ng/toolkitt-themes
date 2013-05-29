var _addMedia_user;

module("AddMedia", {
  setup: function() {
    if(!_addMedia_user) {
      stop();
      _addMedia_user = new Website.Models.User({username:'test',password:'passpass'});
      _addMedia_user.save(null,{
        success:function() {
          notEqual(_addMedia_user.attributes.token, false);
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
asyncTest("Add media to page", 9, function() {
  var page = new Website.Models.Page({
    name:'Add Media Test Page',
    items:[],
    userId:_addMedia_user.get("id")
  });
  page.save(null,{
    success:function() {
      var addMedia = new Website.Views.AddMedia({page:page});
      ok(addMedia != null);
      addMedia.startFilepicker(null,function() {
        //Called after dummy file is saved
        //And the model has been re-fetched
        strictEqual(page.attributes.items.length,1);
        //Check if the page media is correct
        page.media.fetch({
          success:function() {
            strictEqual(page.media.length,1,'Media collection should have one item');
            strictEqual(page.media.at(0).attributes.id,page.attributes.items[0].ID,'Media item should have same id');
            //Check if the number of unprocessed uploads is correct
            var unprocessed = new Website.Collections.UnprocessedUploads();
            unprocessed.fetch({
              success:function() {
                strictEqual(unprocessed.length,1,'There should be one unprocessed item');
                if(unprocessed.length) {
                  strictEqual(unprocessed.at(0).attributes.id,page.attributes.items[0].ID,'Unprocessed item should have same id');
                }
                else {
                  ok(false,'See previous test');
                }
                page.destroy({
                  success:function() {
                    ok(true);
                    //Destroy the test image
                    var destImage = new Website.Models.Image();
                    destImage.set("id",page.attributes.items[0].ID);
                    destImage.destroy({
                      success:function() {
                        ok(true);
                        start();
                      },
                      error:function() {
                        ok(false);
                        start();
                      }
                    });
                  },
                  error:function() {
                    ok(false);
                    start();
                  }
                });
              },
              error:function() {
                ok(false);
                start();
              }
            });
          },
          error:function(err) {
            ok(false,err);
          }
        });
      });
    },
    error:function(err) {
      ok(false,err);
    }
  });
});