var BaseView = Backbone.View.extend({
  assign : function (view, selector) {
      view.setElement(this.$(selector)).render.apply(view);
  }
});