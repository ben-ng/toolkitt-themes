//Parse the bootstrapped vars if possible
if(TK.userVars) {
  try {
    TK.userVars = JSON.parse(decodeURIComponent(TK.userVars));
  }
  catch(e) {
    //Do nothing
    TK.userVars = {};
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