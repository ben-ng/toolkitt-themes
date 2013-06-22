(function () {
  var guiderList = [
      {
        id: "index",
        buttons: [{name: "Next"}],
        next: "indexAddpage",
        overlay: true,
        title: "Welcome to your portfolio website!",
        autofocus: false,
        description: "It's a little plain right now, but we're going to change that real fast."
      }
    , {
        id: "indexAddpage",
        buttons: [],
        attachTo: "#newPageLink",
        position: 6,
        overlay: false,
        title: "Add a Page",
        description: "Pages keep your portfolio organized. Click this button to add a page."
      }
    , {
        id: "createPage",
        buttons: [],
        attachTo: "#name",
        position: 3,
        overlay: false,
        title: "Simple names work best",
        description: "Simple, one word names like 'Reel', or 'Commercials' work best."
      }
    , {
        id: "addMedia",
        buttons: [],
        attachTo: "#addMediaLink",
        position: 6,
        overlay: false,
        title: "Adding Content",
        description: "Click this button to add some content to your new page."
      }
    , {
        id: "uploadFile",
        buttons: [],
        attachTo: "#uploadFileLink",
        position: 6,
        overlay: false,
        title: "Upload Files",
        description: "Click this button to upload some images or videos."
      }
    , {
        id: "reviewFile",
        attachTo: "#firstFixButton",
        position: 6,
        overlay: false,
        title: "Fix This File",
        description: "Click this button to add a thumbnail"
      }
    , {
        id: "uploadThumb",
        attachTo: "#firstFixButton",
        position: 6,
        overlay: false,
        title: "Fix This File",
        description: "Click this button to add a thumbnail"
      }
    , {
        id: "thumbnailImage",
        buttons: [{name: "Next"}],
        next: "thumbnailImageCustom",
        attachTo: "#useOriginalButton",
        position: 3,
        overlay: true,
        title: "The One-Click Fix",
        description: "Click this button to use the original image as your thumbnail. You can do this with videos too!"
      }
    , {
        id: "captureImage",
        buttons: [{name: "Next"}],
        next: "thumbnailImageCustom",
        attachTo: "#useCaptureButton",
        position: 3,
        overlay: true,
        title: "The One-Click Fix",
        description: "Use the video progress bar to find a frame you like, then click this button to use it as your thumbnail."
      }
    , {
        id: "thumbnailImageCustom",
        buttons: [{name: "Next"}],
        next: "editImageName",
        attachTo: "#useCustomButton",
        position: 3,
        overlay: true,
        title: "Custom Thumbnails",
        description: "You can use this button to upload a custom thumbnail for total control."
      }
    , {
        id: "editImageName",
        buttons: [{name: "Next"}],
        next: "afterEditing",
        attachTo: "#fileNameField",
        position: 3,
        overlay: true,
        title: "Appearances Are Everything",
        description: "These attributes control how this file appears on your website."
      }
    , {
        id: "afterEditing",
        buttons: [{name: "Next"}],
        next: "endTutorial",
        attachTo: "#mainnav",
        position: 6,
        overlay: true,
        title: "After You're Done",
        description: "Once you're done reviewing all your uploads, just use the navbar to get back to your page."
      }
    , {
        id: "endTutorial",
        overlay: true,
        title: "That's All!",
        autofocus: false,
        description: "Get in touch with me if you have any questions or suggestions: ben@toolkitt.com.<br /><br />Have fun, and thanks for trying Toolkitt."
      }
    ]
  , defaults = {
      autoFocus: true
    , onShow: function () {
        this.showTime = (new Date).getMilliseconds();
      }
    , onHide: function () {
        //Don't hide in case of a re-render
        if( (new Date()).getMilliseconds() - this.showTime > 1000) {
          $.cookie('guider_'+this.id,'true',{expires:99999});
        }
      }
    , shouldSkip: function () {
        return $.cookie('guider_'+this.id);
      }
    };
  
  _.each(guiderList, function (guider) {
    guiders.createGuider(_.extend({},defaults,guider));
  });
}());