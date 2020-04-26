var is = require("electron-is"); // required to know the platform

function appendOutput(msg) { getCommandOutput().value += (msg+'\n'); }; // appends output to the given document
function setStatus(msg)    { getStatus().innerHTML = msg; }; // sets the value of a document

function showOS() { // display the platform
    if (is.windows())
      appendOutput("Windows Detected.")
    if (is.macOS())
      appendOutput("Apple OS Detected.")
    if (is.linux())
      appendOutput("Linux Detected.")
}

// This function is responsible for recognizing the platform and 
// running the shell or bash script.
function backgroundProcess(execLocation) {
    console.log(execLocation)
    const process = require('child_process');   // The power of Node.JS
    const ipcRenderer = require('electron').ipcRenderer; // This const is responsible for IPC communication with the main process
    const path = require("path"); // This const is responsible for finding the absolute path of the batch file/ shell script 
    showOS(); // shows the platform in the console
    var cmd = (is.windows()) ? 'test.bat' : 'test.sh'; // recognizes the platform and chooses the correct script      
     
    
    const scriptPath = path.join(execLocation, cmd); //sets the script path
    console.log("cmd: "+scriptPath) // prints the path of the script

    var child = process.spawn(scriptPath);  // runs the script

    child.on('error', function(err) {
      appendOutput('stderr: <'+err+'>' ); // prints the errors 
    });

    child.stdout.on('data', function (data) {
      appendOutput(data); // once the data is received, its prints on the second render process screen
      console.log(data); // data is printed on the console
      var msg = (data + '') 
      ipcRenderer.send('data', msg); // sends the data to the main render process to be printed in the console
      setStatus('IN PROGRESS'); //sets the status to IN_PROGRESS while the data is being received 
    });

    child.stderr.on('data', function (data) {
      appendOutput('stderr: <'+data+'>' ); // shows the error if any
    });

    child.on('close', function (code) {
        if (code == 0)
          setStatus('DONE.'); // sets the status to DONE once the script is done running
          
        else
          setStatus('exited with code ' + code); // 
        ipcRenderer.send('complete', 'c'); // sends complete signal to the main render process to re-activate the start button
        getCommandOutput().style.background = "DarkGray"; 
    });
};
