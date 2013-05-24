Website.Models.Folder = Backbone.Model.extend({
  urlRoot:TK.baseURL+'/folders',
  methodUrl: function(method) {
    if(method == "delete"){
      return this.urlRoot + "/" +this.attributes.id+".json";
    }
    else if(method == "update"){
      return this.urlRoot + "/" +this.attributes.id+".json";
    }
    else if(method == "read"){
      return this.urlRoot + "/" +this.attributes.id+".json";
    }
    else if(method == "create"){
      return this.urlRoot + ".json";
    } 
    return false;
  },
  parse: function(data, options) {
    data = data.folder;
    delete data.folder;
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
  },
  defaults: {
    name:'Untitled',
    items:[],
    userId:'',
    errors:null
  },
  sync: function(method, model, options) {
    if(method === 'create') {
      //For the create method we should stringify the items before sending to the server
      model.set("itemList",JSON.stringify(model.get("items")));
    }
    Backbone.sync(method, model, options);
  }
});