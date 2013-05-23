Website.Models.User = Backbone.Model.extend({
  url:TK.baseURL+'/users/auth.json',
  parse: function(data, options) {
    data = data.user;
    return data;
  },
  defaults: {
    username:'',
    password:'',
    token:false,
    errors:null
  }
});