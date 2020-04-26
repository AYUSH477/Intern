
console.log("okay");
const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const path = require('path')
const url = require('url')

// Module to create native browser window.
console.log("Printing Path: " + app.getAppPath())

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
app.allowRendererProcessReuse = true;
var mainWindow = null;
var statusWindow = null;
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
  //const {ipcMain} = require('electron').ipcMain;
  // Create the browser window.
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },width: 600, height: 600, x: 0, y:0});
  statusWindow = new BrowserWindow({webPreferences: {
    nodeIntegration: true
  },width: 800, height: 600, x: 590, y: 0, parent: mainWindow});
  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  statusWindow.loadURL('file://' + __dirname + '/index2.html');
  statusWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    statusWindow = null;
  });
  // Open the DevTools.
 // mainWindow.openDevTools();    // requires a height 410px 
  
  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
  
  
});

ipcMain.on("btnclick",function (event, arg) {
    statusWindow.webContents.send("start_script", app.getAppPath()); 
  });

  ipcMain.on("data",function (event, arg) {
    console.log(arg); 
  });
  ipcMain.on("complete", function (event, arg) {
    mainWindow.webContents.send("complete", arg); 
  });





