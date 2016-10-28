require('events').EventEmitter.prototype._maxListeners = 0;
const electron = require('electron')
const ipc = electron.ipcMain;
const {ipcMain} = require('electron')
const app = electron.app
const path = require('path');
const BrowserWindow = electron.BrowserWindow


let mainWindow

function createWindow () {
  
  mainWindow = new BrowserWindow({width: 800, height: 600,
    webPreferences: {
			//preload: path.join(__dirname, './browser/browser.js')
		}
    });

  mainWindow.loadURL(`file://${__dirname}/index.html`)
  
  mainWindow.webContents.on('did-finish-load', () => {
    console.log(' mainwindow cleadid-finish-load');
	});

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Listen for notification events.
	ipc.on('notification-shim', (e, msg) => {
		console.log(`Title: ${msg.title},Msg: ${msg.options.body}`);
    mainWindow.webContents.send('ping', msg.options.body)
    e.sender.send('message-received', msg.options.body);
	});
  //listen to events via channel by ipc
  ipcMain.on('asynchronous-message', (event, arg) => {
      //reply back on 
      event.sender.send('asynchronous-reply', 'pong')
  })
  //Deepankar


  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
