Website.Views.Navbar = BaseView.extend({
  initialize: function(options) {
    if(options.pages) {
      this.pages = options.pages;
    }
    this.listenTo(this.pages, 'change add remove sort',this.render,this);
    this.listenTo(Website.user, 'change', this.render,this);
    this.listenTo(Website.Router, 'all', this.render, this)
  },
  render: function() {  
    var self = this;
    var editHref = null;
    var modelAttrs = [];
    
    this.pages.forEach(function(model) {
      var attrs = _.extend(_.clone(model.attributes), {
        href: '/page/'+encodeURIComponent(model.attributes.name),
        editHref: '/editPage/'+encodeURIComponent(model.attributes.name),
        active: false
      });
      if(
        //Exact match
        Backbone.history.fragment === attrs.href.replace(/^\//,'') ||
        //Edit page
        Backbone.history.fragment === 'editPage/'+model.attributes.name
      ) {
        attrs.active = true;
        editHref = attrs.editHref;
      }
      modelAttrs.push(attrs);
    });
    
    
    Website.loadTemplate(this,'partials/navbar',function(err) {
      self.$el.html(self.template(
        _.extend(_.clone(Website.userVars),{
          pages:modelAttrs,
          editHref:editHref,
          createHref:'/createPage',
          isHome:Backbone.history.fragment === '',
          isPage:Backbone.history.fragment.match(/^(edit)?[pP]age\//)?true:false,
          isEditingPage:Backbone.history.fragment.match(/^editPage\//)?true:false,
          isCreatingPage:Backbone.history.fragment.match(/^createPage/)?true:false
        })
      ));
    });
    return self;
  }
});