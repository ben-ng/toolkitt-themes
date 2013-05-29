var _image_user;

module("Website");
test("isVideo", function() {
  strictEqual(Website.util.isVideo('xxx.avi'),true);
  strictEqual(Website.util.isVideo('xxx.mp4'),true);
  strictEqual(Website.util.isVideo('xxx.gif'),false);
  strictEqual(Website.util.isVideo('xxx.png'),false);
  strictEqual(Website.util.isImage('xxx.avi'),false);
  strictEqual(Website.util.isImage('xxx.mp4'),false);
  strictEqual(Website.util.isImage('xxx.gif'),true);
  strictEqual(Website.util.isImage('xxx.png'),true);
});