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
asyncTest("Add media to page", 4, function() {
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
        page.destroy({
          success:function() {
            ok(true);
            start();
          },
          error:function() {
            ok(false);
            start();
          }
        });
      });
    },
    error:function(err) {
      ok(false,err);
    }
  });
});