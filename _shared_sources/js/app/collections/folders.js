Website.Collections.Folders = Backbone.Collection.extend({
  url:TK.baseURL+'/folders.json',
  model:Website.Models.Folder,
  parse: function(data, options) {
    return data.folders;
  },
  defaults: {
    name:'Untitled',
    items:[],
    userId:'',
    errors:null
  },
  sync: function(method, model, options) {
    Backbone.sync(method, model, options);
  }
});