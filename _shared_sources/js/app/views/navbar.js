Website.Views.Navbar = BaseView.extend({
  initialize: function(options) {
    if(options.pages) {
      this.pages = options.pages;
    }
    if(options.unprocessed) {
      this.unprocessed = options.unprocessed;
    }
    this.listenTo(this.pages, 'change add remove sort',this.render,this);
    this.listenTo(this.unprocessed, 'change add remove',this.render,this);
    this.listenTo(Website.user, 'change', this.render,this);
    this.listenTo(Website.Router, 'all', this.render, this)
  },
  render: function() {  
    var self = this;
    var addMediaHref = null;
    var editPageHref = null;
    var modelAttrs = [];
    
    //Load pages
    this.pages.forEach(function(model) {
      var safename = encodeURIComponent(model.attributes.name);
      var attrs = _.extend(_.clone(model.attributes), {
        href: '/page/'+safename,
        editHref: '/page/'+safename+'/edit',
        addHref: '/page/'+safename+'/addMedia',
        active: false
      });
      if(
        //Exact match
        Backbone.history.fragment === attrs.href.replace(/^\//,'') ||
        //Editing or adding media to page
        Backbone.history.fragment.indexOf('page/'+safename+'/')==0
      ) {
        attrs.active = true;
        editPageHref = attrs.editHref;
        addMediaHref = attrs.addHref;
      }
      modelAttrs.push(attrs);
    });
    
    //Count unprocessed files
    var unprocessedCount = this.unprocessed.length;
    var unprocessedPrompt = this.unprocessed.length + " upload" + (this.unprocessed.length===1?"":"s") + " need" + (this.unprocessed.length!==1?"":"s") + " review";
    
    Website.loadTemplate(this,'partials/navbar',function(err) {
      self.$el.html(self.template(
        _.extend(_.clone(Website.userVars),{
          pages:modelAttrs,
          editPageHref:editPageHref,
          addMediaHref:addMediaHref,
          createHref:'/createPage',
          reviewHref:'/reviewPage',
          isHome:Backbone.history.fragment === '',
          isPage:Backbone.history.fragment.match(/^(edit)?[pP]age\//)?true:false,
          isEditingPage:Backbone.history.fragment.match(/^page\/[a-zA-Z0-9\-]+\/edit$/)?true:false,
          isAddingMedia:Backbone.history.fragment.match(/^page\/[a-zA-Z0-9\-]+\/addMedia$/)?true:false,
          isEditingMedia:Backbone.history.fragment.match(/^media\/(image|video)\/[a-zA-Z0-9\-]+\/edit$/)?true:false,
          isCreatingPage:Backbone.history.fragment.match(/^createPage/)?true:false,
          isReviewingUploads:Backbone.history.fragment.match(/^review/)?true:false,
          unprocessedCount:unprocessedCount,
          unprocessedPrompt:unprocessedPrompt
        })
      ));
    });
    return self;
  }
});