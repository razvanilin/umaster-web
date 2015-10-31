var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var path = require('path');
var express = require('express');
var session = require('express-session');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var _ = require('lodash');
var expressApp = express();
var cors = require('cors');

// Report crashes to our server.
require('crash-reporter').start();

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

expressApp.use(express.static(path.join(__dirname, 'app')));
expressApp.set('/', path.join(__dirname, 'app'));

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1024, height: 764, title: "uMaster"});

  // and load the index.html of the app.
  mainWindow.loadUrl('http://localhost:9000/');

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  var routes = require('./routes');
  _.each(routes, function(controller, route) {
    expressApp.use(route, controller(expressApp, route));
  });


  expressApp.listen(8000);
});