guiders.createGuider({
  id: "index",
  buttons: [{name: "Next"}],
  next: "indexAddpage",
  overlay: true,
  title: "Welcome to your portfolio website!",
  description: "It's a little plain right now, but we're going to change that real fast."
});
guiders.createGuider({
  id: "indexAddpage",
  buttons: [],
  attachTo: "#newPageLink",
  position: 6,
  overlay: false,
  title: "Add a Page",
  description: "Pages keep your portfolio organized. Click this button to add a page."
});
guiders.createGuider({
  id: "createPage",
  buttons: [],
  attachTo: "#name",
  position: 3,
  overlay: false,
  title: "Simple names work best",
  description: "Simple, one word names like 'Reel', or 'Commercials' work best."
});
guiders.createGuider({
  id: "addMedia",
  buttons: [],
  attachTo: "#addMediaLink",
  position: 6,
  overlay: false,
  title: "Adding Content",
  description: "Click this button to add some content to your new page."
});
guiders.createGuider({
  id: "uploadFile",
  buttons: [],
  attachTo: "#uploadFileLink",
  position: 6,
  overlay: false,
  title: "Upload Files",
  description: "Click this button to upload some images or videos."
});
guiders.createGuider({
  id: "reviewFile",
  attachTo: "#firstFixButton",
  position: 6,
  overlay: false,
  title: "Fix This File",
  description: "Click this button to add a thumbnail"
});
guiders.createGuider({
  id: "uploadThumb",
  attachTo: "#firstFixButton",
  position: 6,
  overlay: false,
  title: "Fix This File",
  description: "Click this button to add a thumbnail"
});
guiders.createGuider({
  id: "thumbnailImage",
  buttons: [{name: "Next"}],
  next: "thumbnailImageCustom",
  attachTo: "#useOriginalButton",
  position: 3,
  overlay: true,
  title: "The One-Click Fix",
  description: "Click this button to use the original image as your thumbnail."
});
guiders.createGuider({
  id: "thumbnailImageCustom",
  buttons: [{name: "Next"}],
  next: "editImageName",
  attachTo: "#useCustomButton",
  position: 3,
  overlay: true,
  title: "Custom Thumbnails",
  description: "You can use this button to upload a custom thumbnail for total control."
});
guiders.createGuider({
  id: "editImageName",
  buttons: [{name: "Next"}],
  next: "afterEditing",
  attachTo: "#fileNameField",
  position: 3,
  overlay: true,
  title: "Appearances Are Everything",
  description: "These attributes control how this file appears on your website."
});
guiders.createGuider({
  id: "afterEditing",
  buttons: [{name: "Next"}],
  next: "endTutorial",
  attachTo: "#mainnav",
  position: 6,
  overlay: true,
  title: "After You're Done",
  description: "Once you're done reviewing all your uploads, just use the navbar to get back to your page."
});
guiders.createGuider({
  id: "endTutorial",
  overlay: true,
  title: "That's All!",
  description: "Get in touch with me if you have any questions or suggestions: ben@toolkitt.com.<br /><br />Have fun, and thanks for trying Toolkitt."
});