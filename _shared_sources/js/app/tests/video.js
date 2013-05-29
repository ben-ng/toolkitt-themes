var _video_user;

module("Video", {
  setup: function() {
    if(!_video_user) {
      stop();
      _video_user = new Website.Models.User({username:'test',password:'passpass'});
      _video_user.save(null,{
        success:function() {
          notEqual(_video_user.attributes.token, false);
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
  var video = new Website.Models.Video();
  ok(video != null);
});
asyncTest("Save, Update & Delete", 18, function() {
  var video = new Website.Models.Video({
    name:'Test Video',
    s3key:'baz',
    mimeType:'video/png',
    originalFilesize:9000,
    userId:_video_user.get("id"),
    attribs:[{author:'Tom',year:1991}],
    status:0
  });
  video.save(null,{
    success:function() {
      equal(video.attributes.errors, null, "Save errors: "+JSON.stringify(video.attributes.errors));
      strictEqual(video.attributes.name, "Test Video");
      strictEqual(video.attributes.s3key, "baz");
      strictEqual(video.attributes.mimeType, "video/png");
      strictEqual(video.attributes.originalFilesize, 9000);
      strictEqual(video.attributes.userId, _video_user.get("id"));
      deepEqual(video.attributes.attribs, [{author:'Tom',year:1991}]);
      strictEqual(video.attributes.status, 0);
      
      //Perform an edit
      video.set("name","Changed Test Video");
      
      video.save(null,{
        success:function() {
          equal(video.attributes.errors, null, "Save errors: "+JSON.stringify(video.attributes.errors));
          strictEqual(video.attributes.name, "Changed Test Video","Changed video name correctly");
          strictEqual(video.attributes.s3key, "baz");
          strictEqual(video.attributes.mimeType, "video/png");
          strictEqual(video.attributes.originalFilesize, 9000);
          strictEqual(video.attributes.userId, _video_user.get("id"));
          deepEqual(video.attributes.attribs, [{author:'Tom',year:1991}]);
          strictEqual(video.attributes.status, 0);
          
          //Destroy the video
          video.destroy({
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
      ok(false, JSON.stringify(err));
      start();
    }
  });
});