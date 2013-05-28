Website.Models.Image = BaseModel.extend({
  urlRoot:TK.baseURL+'/images',
  defaults:{
    name: 'Untitled',
    s3key: null,
    mimeType: null,
    originalFilesize: null,
    userId: null,
    attribs: [],
    status: 0
  },
  sync: function(method, model, options) {
    if(method === 'create' || method === 'update') {
      //For the create method we should stringify the items before sending to the server
      model.set("userAttributes",JSON.stringify(model.get("attribs")));
    }
    Backbone.sync(method, model, options);
  },
  parse: function(data, options) {
    data = data.image;
    delete data.image;
    try {
      data.attribs = JSON.parse(data.userAttributes);
    }
    catch(e) {
      data.attribs = [];
    }
    finally {
      delete data.userAttributes;
    }
    return data;
  }
});