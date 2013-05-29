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
    var addMediaHref = null;
    var editPageHref = null;
    var modelAttrs = [];
    
    this.pages.forEach(function(model) {
      var safename = encodeURIComponent(model.attributes.name);
      var attrs = _.extend(_.clone(model.attributes), {
        href: '/page/'+safename,
        editHref: '/editPage/'+safename,
        addHref: '/editPage/'+safename+'/addMedia',
        active: false
      });
      if(
        //Exact match
        Backbone.history.fragment === attrs.href.replace(/^\//,'') ||
        //Editing or adding media to page
        Backbone.history.fragment.indexOf('editPage/'+safename)==0
      ) {
        attrs.active = true;
        editPageHref = attrs.editHref;
        addMediaHref = attrs.addHref;
      }
      modelAttrs.push(attrs);
    });
    
    
    Website.loadTemplate(this,'partials/navbar',function(err) {
      self.$el.html(self.template(
        _.extend(_.clone(Website.userVars),{
          pages:modelAttrs,
          editPageHref:editPageHref,
          addMediaHref:addMediaHref,
          createHref:'/createPage',
          isHome:Backbone.history.fragment === '',
          isPage:Backbone.history.fragment.match(/^(edit)?[pP]age\//)?true:false,
          isEditingPage:Backbone.history.fragment.match(/^editPage\/[a-zA-Z0-9%]+$/)?true:false,
          isAddingMedia:Backbone.history.fragment.match(/^editPage\/[a-zA-Z0-9%]+\/addMedia$/)?true:false,
          isCreatingPage:Backbone.history.fragment.match(/^createPage/)?true:false
        })
      ));
    });
    return self;
  }
});