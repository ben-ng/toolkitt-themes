Website.Models.Page = BaseModel.extend({
  urlRoot:TK.baseURL+'/pages',
  defaults: {
    name:'Untitled',
    items:[],
    userId:'',
    errors:null
  },
  sync: function(method, model, options) {
    if(method === 'create' || method === 'update') {
      //For the create method we should stringify the items before sending to the server
      model.set("itemList",JSON.stringify(model.get("items")));
    }
    Backbone.sync(method, model, options);
  },
  parse: function(data, options) {
    data = data.page;
    delete data.page;
    try {
      data.items = JSON.parse(data.itemList);
    }
    catch(e) {
      data.items = [];
    }
    finally {
      delete data.itemList;
    }
    return data;
  }
});