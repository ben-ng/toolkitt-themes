var _image_user;

module("Image", {
  setup: function() {
    if(!_image_user) {
      stop();
      _image_user = new Website.Models.User({username:'test',password:'passpass'});
      _image_user.save(null,{
        success:function() {
          notEqual(_image_user.attributes.token, false);
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
  var image = new Website.Models.Image();
  ok(image != null);
});
asyncTest("Save, Update & Delete", 18, function() {
  var image = new Website.Models.Image({
    name:'Test Image',
    s3key:'baz',
    mimeType:'image/png',
    originalFilesize:9000,
    userId:_image_user.get("id"),
    attribs:[{author:'Tom',year:1991}],
    status:0
  });
  image.save(null,{
    success:function() {
      equal(image.attributes.errors, null, "Save errors: "+JSON.stringify(image.attributes.errors));
      strictEqual(image.attributes.name, "Test Image");
      strictEqual(image.attributes.s3key, "baz");
      strictEqual(image.attributes.mimeType, "image/png");
      strictEqual(image.attributes.originalFilesize, 9000);
      strictEqual(image.attributes.userId, _image_user.get("id"));
      deepEqual(image.attributes.attribs, [{author:'Tom',year:1991}]);
      strictEqual(image.attributes.status, 0);
      
      //Perform an edit
      image.set("name","Changed Test Image");
      
      image.save(null,{
        success:function() {
          equal(image.attributes.errors, null, "Save errors: "+JSON.stringify(image.attributes.errors));
          strictEqual(image.attributes.name, "Changed Test Image","Changed image name correctly");
          strictEqual(image.attributes.s3key, "baz");
          strictEqual(image.attributes.mimeType, "image/png");
          strictEqual(image.attributes.originalFilesize, 9000);
          strictEqual(image.attributes.userId, _image_user.get("id"));
          deepEqual(image.attributes.attribs, [{author:'Tom',year:1991}]);
          strictEqual(image.attributes.status, 0);
          
          //Destroy the image
          image.destroy({
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