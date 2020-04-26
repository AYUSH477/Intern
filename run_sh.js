
var is = require("electron-is");

function appendOutput(msg) { getCommandOutput().value += (msg+'\n'); };
function setStatus(msg)    { getStatus().innerHTML = msg; };

function showOS() {
    if (is.windows())
      appendOutput("Windows Detected.")
    if (is.macOS())
      appendOutput("Apple OS Detected.")
    if (is.linux())
      appendOutput("Linux Detected.")
}

function backgroundProcess(execLocation) {
    console.log(execLocation)
    const process = require('child_process');   // The power of Node.JS
    const ipcRenderer = require('electron').ipcRenderer;
    const path = require("path");
    showOS();
    var cmd = (is.windows()) ? 'test.bat' : 'test.sh';      
     
    
    const scriptPath = path.join(execLocation, cmd);
    console.log("cmd: "+scriptPath)

    var child = process.spawn(scriptPath); 

    child.on('error', function(err) {
      appendOutput('stderr: <'+err+'>' );
    });

    child.stdout.on('data', function (data) {
      appendOutput(data);
      console.log(data);
      var msg = (data + '')
      ipcRenderer.send('data', msg);
      setStatus('IN PROGRESS');
    });

    child.stderr.on('data', function (data) {
      appendOutput('stderr: <'+data+'>' );
    });

    child.on('close', function (code) {
        if (code == 0)
          setStatus('DONE.');
          
        else
          setStatus('exited with code ' + code);
        ipcRenderer.send('complete', 'c');
        getCommandOutput().style.background = "DarkGray";
    });
};
