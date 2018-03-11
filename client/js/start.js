$(document).ready(function () {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
        window.location = "/client/play.html";
       } else {
        window.location = "/client/host.html";
       }
/*     if ($(window).width() >= 1000) {
    } else {
    }
 */});
