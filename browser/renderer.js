// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
//  require('electron-notification-shim')();
 console.log('renderer.js called');
 var unread = 0;
 const remote = require('electron').remote;
 const Menu = remote.Menu;
 const MenuItem = remote.MenuItem;
 const {ipcRenderer} = require('electron')
 var menu = new Menu();
 
 Menu.setApplicationMenu(menu);
 window.onresize = doLayout;
 function getWebView(){
  if (!getWebView.view)
    getWebView.view = document.querySelector('webview');
  return getWebView.view;
 
}
window.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  menu.popup(remote.getCurrentWindow());
}, false);

//connecting main and render
require('electron').ipcRenderer.on('ping', (event, message) => {
      console.log(message)
});
console.log('renderer.js: ' + ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"
ipcRenderer.on('asynchronous-reply', (event, arg) => {
    console.log('renderer.js: ' +arg) // prints "pong"
});
ipcRenderer.send('asynchronous-message', 'ping');
//connecting main and render 

onload = function() {
    var webview = getWebView();

    webview.addEventListener("dom-ready", function(){     
        //webview.executeJavaScript('__myYoutubeTools.pauseVideo()')
        webview.openDevTools();
    });
    
    webview.addEventListener('keydown', handleKeyDown);
    webview.addEventListener('message', onWebViewMessage);
    webview.addEventListener('focus', function() { webview.focus(); });
    doLayout();

    webview.addEventListener('loadstart', handleLoadStart);
    webview.addEventListener('loadstop', injectJS);


    // document.querySelector('#pause').onclick = function() {
    //     alert('renderer.js called document.querySelector(#pause).onclick ')
    //     webview.executeJavaScript('__myYoutubeTools.pauseVideo()')
    // };

    // document.querySelector('#play').onclick = function() {
    //     webview.executeJavaScript('__myYoutubeTools.playVideo()')
    // };

    // document.querySelector('#pauseNstart').onclick = function() {
    //     webview.executeJavaScript('__myYoutubeTools.playNpauseVideo()')
    // };

    webview.addEventListener('console-message', (e) => {
        console.log('Guest page logged a message:', e.message)
    })

    webview.addEventListener('newwindow', function(e) {
        e.stopImmediatePropagation();
        window.open(e.targetUrl);
    });
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

function handleLoadStart(e)
{
  if (e.isTopLevel)
  {
    var parser = document.createElement('a');
    parser.href = e.url;

    if (parser.hostname.match(/^(.*\.)?whatsapp.[^.]*$/i) === null)
    {
      e.stopImmediatePropagation();
      getWebView().stop();
      window.open(e.url);
    }
  }
}

function onWebViewMessage(msg)
{
  var data = msg.data;

  if (data === 'initialized')
  {
    console.debug('Web View initialized');
  }
  else if (typeof(data.unread) != 'undefined')
  {
    var this_win = chrome.app.window.current();
    if (data.unread > unread)
    {
      this_win.drawAttention();
    }
    else if (data.unread === 0)
    {
      this_win.clearAttention();
    }
    unread = data.unread;
  }
  else if (data === 'focus')
  {
    chrome.app.window.current().focus();
  }
}

function handleKeyDown(event)
{
  if (event.ctrlKey && !event.altKey)
  {
    switch (event.keyCode)
    {
      case 81: // Ctrl+q
        window.close();
        break;

      case 82: // Ctrl+r
      case 115: // F5
        getWebView().reload();
        break;
    }
  }
}

function injectJS()
{
  var webview = getWebView();
  webview.executeScript({ file: "./inject/inject.js" }, function(res) {
    webview.contentWindow.postMessage('setup', '*');
  });
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
