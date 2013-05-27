Website.Collections.Pages = Backbone.Collection.extend({
  url: TK.baseURL+'/pages.json',
  model: Website.Models.Page,
  parse: function(data, options) {
    return data.pages;
  }
});