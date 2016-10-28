 var unread = 0;
 const {ipcRenderer} = require('electron')
 
 ipcRenderer.on('click event triggered', (event, arg) => {
    console.log('click event triggered' +arg )
    document.getElementsByClassName(arg).click();
});

//connecting main and render
require('electron').ipcRenderer.on('ping', (event, message) => {
      console.log(message)
});
ipcRenderer.on('asynchronous-reply', (event, arg) => {
    console.log('renderer.js: ' +arg) // prints "pong"
});
ipcRenderer.send('asynchronous-message', 'ping');
//connecting main and render 

onload = function() {
    var webview  = document.getElementById('foo');
    // var webview1 = document.getElementById('foo1');
    webview.addEventListener("dom-ready", function(){     
        //webview.executeJavaScript('__myYoutubeTools.pauseVideo()')
        webview.openDevTools();
    });
    // webview1.addEventListener("dom-ready", function(){     
    //     //webview.executeJavaScript('__myYoutubeTools.pauseVideo()')
    //     webview1.openDevTools();
    // });
    webview.addEventListener('message', onWebViewMessage);
    webview.addEventListener('focus', function() { webview.focus(); });
    webview.addEventListener('loadstop', injectJS);
    webview.addEventListener('console-message', (e) => {
        console.log('Guest page logged a message:', e.message)
    });
    webview.addEventListener('newwindow', function(e) {
        e.stopImmediatePropagation();
        window.open(e.targetUrl);
    });
};

function onWebViewMessage(msg)
{
  var data = msg.data;
  if (data === 'initialized')
  {
    //console.debug('Web View initialized');
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

function injectJS()
{
  var webview = document.getElementById('foo');
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
