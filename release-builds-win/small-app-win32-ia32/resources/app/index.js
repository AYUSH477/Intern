
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
 
  mainWindow = new BrowserWindow({  // Create the browser window.
    webPreferences: {
      nodeIntegration: true
    },width: 600, height: 600, x: 0, y:0}); // specifying the  width of the main WIndow
    
  statusWindow = new BrowserWindow({webPreferences: { // create the status window 
    nodeIntegration: true
  },width: 800, height: 600, x: 590, y: 0, parent: mainWindow}); // setting main window as the parent
  
  mainWindow.loadURL('file://' + __dirname + '/index.html'); // and load the index.html of the app.
  statusWindow.loadURL('file://' + __dirname + '/index2.html'); // load the index2.html of the app.
  statusWindow.on('closed', function() { 
    // Dereference the window object
    statusWindow = null;
  });
  // Open the DevTools.
 // mainWindow.openDevTools();    // requires a height 410px 
  
  
  mainWindow.on('closed', function() { // Emitted when the window is closed.
    // Dereference the window object
    mainWindow = null;
  });
  
  
});
// Once the btnclick signal is received, send start_script signal to statusWindow
ipcMain.on("btnclick",function (event, arg) {
    statusWindow.webContents.send("start_script", app.getAppPath()); 
  });

  // Prints the data received from the render process in the console
  ipcMain.on("data",function (event, arg) {
    console.log(arg); 
  });
  // sends the complete signal to the index.html render process once the script's execution is
  //complete (reactivates the button)
  ipcMain.on("complete", function (event, arg) {
    mainWindow.webContents.send("complete", arg); 
  });





