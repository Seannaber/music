var bg = $('#counter');
var ctx = ctx = bg[0].getContext('2d');
var imd = null;
var circ = Math.PI * 2;
var quart = Math.PI / 2;

ctx.beginPath();
ctx.strokeStyle = '#99CC33';
ctx.lineCap = 'square';
ctx.closePath();
ctx.fill();
ctx.lineWidth = 30.0;

imd = ctx.getImageData(0, 0, 240, 240);

var draw = function(current) {
    ctx.putImageData(imd, 0, 0);
    ctx.beginPath();
    ctx.arc(150, 150, 135, -(quart), ((circ) * current) - quart, false);
    ctx.stroke();
}

// player.ontimeupdate = function() {
// 	draw(youtubeVid.getCurrentTime()/youtubeVid.getDuration());
//   //alert(audio.currentTime);
// }

// youtubeVid.addEventListener("onStateChange", updateBar);

function updateBar () {
    if (YT.PlayerState.PLAYING) {
        draw(player.getCurrentTime()/player.getDuration());
        setTimeout(updateBar,200);
    }
}
