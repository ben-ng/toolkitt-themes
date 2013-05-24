//Thanks!
//http://lostechies.com/derickbailey/2012/01/02/reducing-backbone-routers-to-nothing-more-than-configuration/
Website.BaseRouter = Backbone.Router.extend({
  constructor: function(options){
    Backbone.Router.prototype.constructor.call(this, options);

    if (this.appRoutes){
      this.processAppRoutes(options.app, this.appRoutes);
    }
  },

  processAppRoutes: function(app, appRoutes){
    var method, methodName;
    var route, routesLength;
    var routes = [];
    var router = this;

    for(route in appRoutes){
      routes.unshift([route, appRoutes[route]]);
    }

    routesLength = routes.length;
    for (var i = 0; i < routesLength; i++){

      route = routes[i][0];
      methodName = routes[i][1];
      
      //Maintain scope!
      (function(a,b){
        router.route(a, b,function() {
          app[b].apply(app);
        });
      })(route, methodName);
    }
  }
});