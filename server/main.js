//var app = require('app');  // Module to control application life.
//var BrowserWindow = require('browser-window');  // Module to create native browser window.
var path = require('path');
var express = require('express');
var session = require('express-session');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var _ = require('lodash');
var expressApp = express();
var http = require('http').Server(expressApp);
var cors = require('cors');
var spawn = require('child_process').spawn;

process.on('uncaughtException', function (error) {
  console.log(error.stack);
});

// Report crashes to our server.
//require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

expressApp.settings = require('./settings');

expressApp.use(cookieParser());
expressApp.use(bodyParser.urlencoded({extended: true}));
expressApp.use(bodyParser.json());
expressApp.use(methodOverride('X-HTTP-Method-Override'));
expressApp.use(session({secret: 'umasterc'}));
expressApp.use(cors());

expressApp.use(express.static(path.join(__dirname, 'dist')));
expressApp.set('/', path.join(__dirname, 'dist'));

// Quit when all windows are closed.
/*app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});*/

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
//app.on('ready', function() {
  // Create the browser window.
<<<<<<< HEAD
  mainWindow = new BrowserWindow({width: 1024, height: 764, title: "uMaster", "nodeIntegration":false});
=======
  //mainWindow = new BrowserWindow({width: 1024, height: 764, title: "uMaster-mobile"});
>>>>>>> locker

  // and load the index.html of the app.
  var url = path.join(__dirname, "dist", "index.html");
  //url = url.replace("server\\", "");
  url = "file://" + url;
  console.log(url);
  //mainWindow.loadURL("http://localhost:9003");

  // Emitted when the window is closed.
  //mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    //mainWindow = null;
  //});

  var routes = require('./routes');
  _.each(routes, function(controller, route) {
    expressApp.use(route, controller(expressApp, route));
  });


  http.listen(8001, function(){
    console.log("Listening on port" + 8001);
  });
//});
