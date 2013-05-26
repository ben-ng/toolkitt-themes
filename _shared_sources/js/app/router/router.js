//Thanks!
//http://lostechies.com/derickbailey/2012/01/02/reducing-backbone-routers-to-nothing-more-than-configuration/
Website.AppRouter = Website.BaseRouter.extend({
  appRoutes: {
    'login':'showLogin',
    'logout':'showLogout',
    'tests':'showTests',
    'createPage':'showCreatePage',
    'page/:name':'showPage',
    '':'showIndex'
  }
});