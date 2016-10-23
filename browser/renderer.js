// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
 require('electron-notification-shim')();

 console.log('renderer.js called');

 const {ipcRenderer} = require('electron')

 require('electron').ipcRenderer.on('ping', (event, message) => {
      console.log(message)
    })

// In renderer process (web page).
console.log('renderer.js: ' + ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

ipcRenderer.on('asynchronous-reply', (event, arg) => {
    console.log('renderer.js: ' +arg) // prints "pong"
})
    
ipcRenderer.send('asynchronous-message', 'ping')

window.onresize = doLayout;

const remote = require('electron').remote;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

var menu = new Menu();
Menu.setApplicationMenu(menu);

window.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  menu.popup(remote.getCurrentWindow());
}, false);

onload = function() {
    var webview = document.querySelector('webview');

    webview.addEventListener("dom-ready", function(){     
        //webview.executeJavaScript('__myYoutubeTools.pauseVideo()')
        // webview.openDevTools();
    });

    doLayout();

    document.querySelector('#pause').onclick = function() {
        alert('renderer.js called document.querySelector(#pause).onclick ')
        webview.executeJavaScript('__myYoutubeTools.pauseVideo()')
    };

    document.querySelector('#play').onclick = function() {
        webview.executeJavaScript('__myYoutubeTools.playVideo()')
    };

    document.querySelector('#pauseNstart').onclick = function() {
        webview.executeJavaScript('__myYoutubeTools.playNpauseVideo()')
    };
};

function doLayout() {
    var webview = document.querySelector('webview');
    var controls = document.querySelector('#controls');
    var controlsHeight = controls.offsetHeight;
    var windowWidth = document.documentElement.clientWidth;
    var windowHeight = document.documentElement.clientHeight;
    var webviewWidth = windowWidth;
    var webviewHeight = windowHeight - controlsHeight;

    webview.style.width = webviewWidth + 'px';
    webview.style.height = webviewHeight + 'px';
}

function handleExit(event) {
    console.log(event.type);
    document.body.classList.add('exited');
    if (event.type == 'abnormal') {
        document.body.classList.add('crashed');
    } else if (event.type == 'killed') {
        document.body.classList.add('killed');
    }
}
