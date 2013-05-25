module("User",{
  setup: function() {
    //Force a log out
    stop();
    var auser = new Website.Models.User();
    auser.save({id:'logout'},{
      success: function(model) {
        strictEqual(model.attributes.token, false, 'User session is clear');
        start();
      },
      error: function(err) {
        ok(false,err);
        start();
      }
    });
  }
});
test("Initialize User", function() {
  var tuser = new Website.Models.User();
  notEqual(tuser, null);
});
asyncTest("Log In (Wrong Password)", 3, function() {
  var user = new Website.Models.User({username:'test',password:'badpass'});
  user.save(null,{
    success:function(usermodel) {
      strictEqual(usermodel.attributes.token, false, 'User was not logged in');
      
      var afreshuser = new Website.Models.User();
      afreshuser.fetch({
        success:function(freshmodel) {
          strictEqual(freshmodel.attributes.token, false, 'User is still logged out');
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
});
asyncTest("Log In (Correct Password)", 3, function() {
  var user = new Website.Models.User({username:'test',password:'passpass'});
  user.save(null,{
    success:function(usermodel) {
      notEqual(usermodel.attributes.token, false, 'User was logged in');
      
      var bfreshuser = new Website.Models.User();
      bfreshuser.fetch({
        success:function(freshmodel) {
          notEqual(freshmodel.attributes.token,false, 'User is logged in');
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
});