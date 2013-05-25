Website.Collections.Folders = Backbone.Collection.extend({
  url:TK.baseURL+'/folders.json',
  model:Website.Models.Folder,
  parse: function(data, options) {
    return data.folders;
  },
});