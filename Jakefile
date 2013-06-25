  /* Modules */
var browserify    = require('browserify')
  , _             = require('lodash')
  , path          = require('path')
  , utils         = require('utilities')
  , clicolor      = require('cli-color')
  , fs            = require('fs')
  , async         = require('async')
  , compressor    = require('node-minify')
  , less          = require('less')
  , server        = require('node-static')
  
  /* Logging convenience functions */
  , error         = clicolor.red.bold
  , success       = clicolor.green
  , info          = clicolor.blue
  
  /* Paths */
  , src           = path.relative(__dirname, '_shared_sources')
  , build         = path.relative(__dirname, '_shared')
  , buildJs       = path.join(build, 'js')
  , buildJsFile   = path.join(build, 'js', 'scripts.js')
  , buildLess     = path.join(build, 'css')
  , buildLessFile = path.join(build, 'css', 'styles.css')
  
  /* LESS/CSS files, in order, relative to source dir */
  , lessFiles     = [
                      "css/video-js.css"
                    , "css/elastislide.css"
                    , "css/jquery.fancybox.css"
                    , "css/jquery.fancybox-buttons.css"
                    , "css/jquery.fancybox-thumbs.css"
                    , "css/bootstrap.css"
                    , "css/bootstrap-responsive.css"
                    , "less/flat-ui.less"
                    , "css/qunit.css"
                    , "css/guiders.css"
                    ];

/* Append source dir to LESS/CSS files */
lessFiles = _.map(lessFiles, function (filePath) {
  return path.join(src,filePath);
});

/*
* Jake tasks follow
*/

desc('Watches the source dir and recompiles on change, serves theme on localhost:8080');
task('default', function () {
  console.log(info('Watching ' + src + ' for changes'));
  
  var timeout
    , delay = 500
    , init = jake.Task.compile
    , serverStarted = false
    , fileServer
    , recompile = function () {
      clearTimeout(timeout);
      
      timeout = setTimeout( function () {
        clearTimeout(timeout);
        init.reenable(true);
        init.invoke();
      }, delay);
    };
  
  init.addListener('complete', function () {
    console.log(success('Compiled at ' + (new Date)));
    
    if(!serverStarted) {
      serverStarted = true;
      
      fileServer = new server.Server(build, {cache: 1});
      
      require('http').createServer(function (request, response) {
        request.addListener('end', function () {
          fileServer.serve(request, response, function (err) {
            if(err) {
              console.log(error("Error serving " + request.url + " - " + err.message));
            }
          });
        }).resume();
      }).listen(8080);
      
      console.log(success('Server running on localhost:8080'));
    }
  });
  
  utils.file.watch(src, recompile);
  
  recompile();
});

desc('Compiles the base theme into _shared');
task('compile', ['clean', build, buildLess, 'resources', 'browserify'], function () {
});

desc('Copies resources into _shared');
task('resources', [buildLessFile], function () {
  var toCopy = ['img', 'fonts', 'swf', 'index.html', 'helper.html', 'favicon.ico'];
  
  _.each(toCopy, function (file) {
    utils.file.cpR(path.join(src,file), path.join(build,file), {silent:true});
  });

  console.log(success(' Resources Built'));
});

desc('Compiles CSS and LESS');
file(buildLessFile, lessFiles, {async:true}, function () {
  var fileReaders = []
    , readFile = function (file) {
        fileReaders.push(function (next) {
          fs.readFile(file, next);
        });
      }
    , parser =  new (less.Parser)({
        paths: [path.join(src,'less')]  // Specify search paths for @import directives
      , filename: 'styles.css'          // Specify a filename, for better error messages
      });
  
  _.each(lessFiles, function (file) {
    readFile(file);
  });
  
  async.parallel(fileReaders, function(err, pieces) {
    if(err) {
      console.log(error(' Could not concat LESS: ' + err));
      complete();
    }
    else {
      
      parser.parse(Buffer.concat(pieces).toString(), function (err, tree) {
        var css = tree.toCSS();
        
        if(err) {
          console.log(error(' Could not compile LESS: ' + err));
          complete();
        }
        else {
          fs.writeFile(buildLessFile, css, function (err) {
            if(err) {
              console.log(error(' Could not writeout LESS: ' + err));
              complete();
            }
            else {
              if(process.env.minify==='true') {
                new compressor.minify({
                    type: 'yui-css',
                    fileIn: buildLessFile,
                    fileOut: buildLessFile,
                    callback: function(err) {
                      if(err) {
                        console.log(error(' Could not compress LESS: ' + err));
                        complete();
                      }
                      else {
                        console.log(success(' LESS Compiled + Minified (' + lessFiles.length + ' files)'));
                        complete();
                      }
                    }
                });
              }
              else {
                console.log(success(' LESS Compiled (' + lessFiles.length + ' files)'));
                complete();
              }
            }
          });
          // /fs.writeFile
        }
        // endif
      });
      // /less.render
    }
  });
  // /async.parallel
});

desc('Browserifies the JS into _shared');
task('browserify', [buildJs], {async:true}, function () {
  var bundle
    , precompile = require('handlebars').precompile
    , handlebarsPlugin = function (body, file) {
        return 'var Handlebars = require(\'handlebars\');\nmodule.exports = ' + precompile(body) + ';';
      };
  
  bundle = browserify();
  bundle.transform(require('hbsfy'));
  bundle.add(path.join(__dirname, src, 'js', 'app', 'index.js'));
  bundle.require('jquery-browserify');
  
  bundle.bundle({debug: true}, function (err, src) {
    if(err) {
      console.log(' Could not browserify: ' + error(err));
      complete();
    }
    else {
      fs.writeFileSync(buildJsFile, src);
      
      if(process.env.minify==='true') {
        new compressor.minify({
            type: 'yui-js',
            fileIn: buildJsFile,
            fileOut: buildJsFile,
            callback: function(err) {
              if(err) {
                console.log(error(' Could not compress JS: ' + err));
                complete();
              }
              else {
                console.log(success(' JS Browserified + Minified'));
                complete();
              }
            }
        });
      }
      else {
        console.log(success(' JS Browserified'));
        complete();
      }
    }
  });
});

desc('Cleans the _shared directory');
task('clean', function () {
  utils.file.rmRf(build, {silent: true});
});

desc('Creates the build directory');
directory(build);

desc('Creates the JS build directory');
directory(buildJs);

desc('Creates the LESS build directory');
directory(buildLess);