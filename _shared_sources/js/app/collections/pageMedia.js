Website.Collections.PageMedia = Backbone.Collection.extend({
  initialize: function(opts) {
    if(opts.page) {
      this.page = opts.page;
    }
  },
  url: function() {
    return TK.baseURL+'/pages/'+this.page.attributes.id+'/media.json'
  },
  model: function(attrs, options) {
    if (attrs.type === 'image') {
      delete attrs.type;
      return new Website.Models.Image(attrs, options);
    } else {
      delete attrs.type;
      return new Website.Models.Video(attrs, options);
    }
  },
  parse: function(data, options) {
    return data.media;
  }
});