module("User");
test("Initialize User", function() {
  var user = new Website.Models.User();
  ok(user != null);
});
asyncTest("Log In (Wrong Password)", 1, function() {
  var user = new Website.Models.User({username:'test',password:'badpass'});
  user.save(null,{
    success:function() {
      ok(user.attributes.token === false);
      start();
    },
    error: function(err) {
      ok(false, err);
      start();
    }
  });
});
asyncTest("Log In (Correct Password)", 1, function() {
  var user = new Website.Models.User({username:'test',password:'pass'});
  user.save(null,{
    success:function() {
      ok(user.attributes.token === 'faketoken');
      start();
    },
    error: function(err) {
      ok(false, err);
      start();
    }
  });
});