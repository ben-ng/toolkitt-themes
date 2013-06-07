Website.Collections.PageMedia = Backbone.Collection.extend({
  name:'media',
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
      return new Website.Models.Image(attrs, options);
    } else {
      return new Website.Models.Video(attrs, options);
    }
  },
  parse: function(data, options) {
    return _.isEmpty(data.media) ? [] : data.media;
  }
});