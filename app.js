/*********************************************
GUI AND ROUTING
*********************************************/
var electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

//app.commandLine.appendSwitch('widevine-cdm-path', "C:/Users/abelanger/AppData/Local/Google/Chrome SxS/Application/67.0.3390.0/WidevineCdm/_platform_specific/win_x64/widevinecdm.dll"); 
app.commandLine.appendSwitch('widevine-cdm-path', "./dependencies/widevinecdm.dll"); 
app.commandLine.appendSwitch('widevine-cdm-version', '1.4.8.984'); 


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
    	app.quit();
    }
});

app.on('ready', function() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 900, 
        height: 600, 
        webPreferences: {
            plugins: true     
        }
    });

    mainWindow.show(); 

    mainWindow.setFullScreen(true); 
    //mainWindow.loadURL("https://netflix.com")
    //mainWindow.loadURL("https://www.directvnow.com"); 
    //mainWindow.loadURL("https://bitmovin.com/mpeg-dash-hls-drm-test-player/"); 

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/public/web.html');

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        mainWindow = null;
    });

    //mainWindow.setMenu(null); 
});

/*********************************************
SOCKET
*********************************************/
var express = require('express'); 
var exp = express(); 
var bodyParser = require('body-parser');
var http = require('http'); 
var server = http.createServer(exp); 

server.listen(process.env.PORT || 3000); 
exp.use(express.static('public'));

var ipc = require('electron').ipcMain; 
var ipc_out;
var out_socket; 

ipc.on("connect", function(event, data) {
    console.log("connected with child"); 
    ipc_out = event.sender;
    var io = require('socket.io').listen(server);
    io.on('connection', function(socket) {
        console.log("new client connected"); 
        socket.on("key-press", function(msg) {
            data = JSON.parse(msg); 
            console.log("received key press: " + data.key); 
            ipc_out.send("key-press", data); 
        }); 

        socket.on("volume", function(msg) {
            console.log(JSON.parse(msg).value); 
        }); 
    }); 
}); 