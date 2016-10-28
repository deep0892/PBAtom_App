'use strict';
require('electron-notification-shim')();
const {ipcRenderer} = require('electron')
var startup = document.querySelector('#startup');
var spinner = document.querySelector('*.spinner-container');
var appwindow = null;
var init_observer = null;
var count_obser = null;
var last_unread = 0;

window.addEventListener('message', function(e) {
  if (!appwindow)
  {
    if (e.data === 'setup')
    {
      appwindow = e.source;
      onLoaded();
    }
  }
  else
  {
    appwindow.postMessage(e.data, '*');
  }
});

document.addEventListener("click", function (e) {
    var search = document.getElementsByClassName("icon icon-search");
    ipcRenderer.send('click event triggered', search);
    // alert('click enter');
});

window.onload = function() {
  // observer created to detect changes in DOM (due to incoming message )
  init_observer = new MutationObserver(function(mutationRecords) {
    var favicon = document.querySelector('#favicon');
    //traverse over mutations
    for (var m in mutationRecords)
    {
      var target = mutationRecords[m].target;
      if (target == favicon)
      {
        send_initialized();
        break;
      }
      else
      {
        var removed_nodes = Array.prototype.slice.call(mutationRecords[m].removedNodes);
        for (var n in removed_nodes)
        {
          if (removed_nodes[n] == startup || removed_nodes[n] == spinner)
          {
            send_initialized();
            break;
          }
        }
      }
    }
  });

  init_observer.observe(document, {subtree: true, attributes: true, childList: true });

  // It would be nicer to initialize this after initialization, but let's be safer
  count_obser = new MutationObserver(verify_unread);
  count_obser.observe(document, {subtree: true, attributes: true });
  verify_unread();

  // Override default focus action with proper chrome action
//   var script = document.createElement('script');
//   script.textContent = '(' + function() {
//     var default_window_focus = window.focus;
//     window.focus = function() {
//       if (default_window_focus)
//         default_window_focus();
//       window.postMessage('focus', '*');
//     }
//   } + ')();';
//   (document.head||document.documentElement).appendChild(script);
//   script.parentNode.removeChild(script);
// }

function send_initialized()
{
  if (!init_observer)
    return;
  appwindow.postMessage('initialized', '*');
  init_observer.disconnect();
  init_observer = null;
}

function unread_count()
{
  var unread_elements = document.querySelectorAll('span.unread-count');
  var unread = 0;
  for (var i = 0; i < unread_elements.length; ++i)
  {
    var count = parseInt(unread_elements[i].textContent);
    if (!isNaN(count))
      unread += count;
  }

  return unread;
}

function verify_unread()
{
  var unread = unread_count();
  if (last_unread != unread)
  {
    appwindow.postMessage({'unread': unread}, '*');
    last_unread = unread;
  }
}
