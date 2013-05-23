//Parse the bootstrapped vars if possible
if(TK.userVars) {
  try {
    TK.userVars = JSON.parse(decodeURIComponent(user_vars));
  }
  catch(e) {
    //Do nothing
  }
}
else {
  TK.userVars = {};
}

TK.baseURL = TK.baseURL ? TK.baseURL : '/';

TK.debug = TK.debug === true;

$(function(){
  //Start the app
  Website.start(TK);
});