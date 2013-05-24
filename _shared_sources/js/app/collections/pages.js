Website.Collections.Pages = Backbone.Collection.extend({
  url:TK.baseURL+'/pages.json',
  model:Website.Models.Page,
  parse: function(data, options) {
    return data.pages;
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