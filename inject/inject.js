//id="pane-side"
 require('electron-notification-shim')();
 


__myYoutubeTools={
    getMP: function(){
        return document.getElementById('pane-side')
    }
    ,pauseVideo: function(){
        alert('injectt.js called pauseVideo')
        document.getElementsByClassName("input")[1].innerHTML="Hiiiiiiiii" // Fills the text box message
        var input = document.getElementsByClassName("icon btn-icon icon-send send-container")//Grabs the send button
        input[0].click();// Clicks the send button
    }
    // ,pauseVideo: function(){
    //     var t=__myYoutubeTools
    //     t.clearPNSTo()
    //     t.getMP().pauseVideo()
    //     t.isPaused=true
    // }
    // ,playVideo: function(){
    //     var t=__myYoutubeTools
    //     t.clearPNSTo()
    //     t.getMP().playVideo()
    //     t.isPaused=false
    // }
    // ,clearPNSTo: function(){
    //     var t=__myYoutubeTools
    //     try{clearTimeout(t.toPNS);}catch(x){}
    // }
    // ,isPaused: true
    // ,toPNS: null
    // ,playNpauseVideo: function(){
    //     // debugger
    //     var t=__myYoutubeTools
    //     if(t.isPaused){
    //         t.playVideo()
    //     }else{
    //         t.pauseVideo()
    //     }
    //     t.toPNS = setTimeout("__myYoutubeTools.playNpauseVideo()",1000);
    // }
}
