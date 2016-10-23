require('events').EventEmitter.prototype._maxListeners = 0;
const electron = require('electron')
const ipc = electron.ipcMain;
const {ipcMain} = require('electron')
const app = electron.app
const path = require('path');
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  
  mainWindow = new BrowserWindow({width: 800, height: 600,
    webPreferences: {
			// Load `electron-notification-shim` in rendering view.
			//preload: path.join(__dirname, './browser/browser.js')
		}
    });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)
  //mainWindow.loadURL(`https://web.whatsapp.com/`)
  
  //Added by Deepankar
  mainWindow.webContents.on('did-finish-load', () => {
    console.log(' mainwindow cleadid-finish-load');
		//mainWindow.webContents.executeJavaScript('new Notification("Hello!", {content: "Notification world!"})');
	});

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  //Deepankar
  // Listen for notification events.
	ipc.on('notification-shim', (e, msg) => {
		console.log(`Title: ${msg.title},Msg: ${msg.options.body}`);
    //e.sender.send('notification-shim-demo-event', 'Hello to you too!');
    mainWindow.webContents.send('ping', msg.options.body)
	});
  
      ipcMain.on('asynchronous-message', (event, arg) => {
        console.log('main.js')  // prints "ping"
        event.sender.send('asynchronous-reply', 'pong')
     })
  ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg)  // prints "ping"
  event.returnValue = 'pong'
  })
  //Deepankar

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
