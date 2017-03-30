
var player;
var songNum = 1;
var songs = [];
songs[0] = new song ("Suzanne Kraft","No Worries (Secret Circuit Professional Gold Mix)","AtyOo0OePPA","1FTn5osUbCr8n7WgYmbK5m","https://f4.bcbits.com/img/a2725264209_10.jpg")
songs[1] = new song ("Young Marco","Psychotic Particle","8J47f2om1zs","7zpN81tVvPwlHcJSkSCyRa","http://redlightradio.net/wp-content/uploads/2016/06/Young-Marco-2015-3.jpg");
songs[songNum].changeBg("song" + songNum);

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    videoId: songs[songNum].youtubeId,
    events: {
      'onReady': onPlayerReady,
    //   'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  $("#songName").html(songs[songNum].artist + "-" + songs[songNum].title);
  // bind events
  var playButton = $("#play-button");
  playButton.on("click", function() {
    player.playVideo();
    $(this).animate({
      // height: 400,
      opacity: "toggle"}, 450, function() {
        $(this).hide().fadeOut(function() {
          pauseButton.show();
        });
      });
    
  });
  
  var pauseButton = $("#pause-button");
  // pauseButton.hide();
  pauseButton.on("click", function() {
    player.pauseVideo();
    $(this).animate({
      // height: 400,
      opacity: "toggle"}, 450, function() {
        $(this).hide().fadeOut(function() {
          playButton.show();
        });
      });
    
  });
  
}

$("#player").hide();
$("audio").hide();

var screenHeight = screen.height;
$('body').css({'padding-top': screenHeight/2});
$('#main').css('min-height', screenHeight);
// $('body').css('min-height', screenHeight);

var spotifyApi = new SpotifyWebApi();
    var artistId = songs[songNum].spotifyId;
    spotifyApi.getArtistRelatedArtists(artistId, 
            function(err, d){
        // list the related artists to the page
        var relatedArtists = d.artists;
        for (var i=0;i<5;i++) {
            $("#related").append("<li>" + relatedArtists[i].name + "<img src=img/play.png class=preview onclick=\"loadTrack('" + relatedArtists[i].id + "')\"></li>");
          };
        })



    //     var artistName = d.artists[0].name;
    //     $("#related").text(artistName);
    //     // try adding the album art 
    //     // for this track in your page!
    //     // var albumArt = d.album.images[0].url;
    //     // $("#albumart").attr("src",albumArt);
    //     // // try adding an audio tag with 
    //     // // the source of the preview_url 
    //     // // in your page!
    //     // var previewUrl = d.preview_url;
    //     // $("audio").attr("src",previewUrl);
    // });

var audio = $('#spotifyPlayer');

$('.preview').on('click.toggle', function (e) {
    if (!audio.paused) {
        audio.pause();
    } else {
        audio.play();
    }
    $(this).toggleClass('paused');
 });

loadTrack = function(artistId) {
  spotifyApi.getArtistTopTracks(artistId, 'US', 
    function(err, d){
      var previewUrl = d.tracks[0].preview_url;
      audio.attr("src",previewUrl);
      player.pauseVideo();
      audio[0].play();
      var albumArt = d.tracks[0].album.images[0].url;
      $("body").css("backgroundImage","url('" + albumArt + "')");
    })
};



function song (artist, title, youtubeId, spotifyId, bgImage) {
  this.artist = artist,
  this.title = title,
  this.youtubeId = youtubeId,
  this.spotifyId = spotifyId,
  this.changeBg = function (songNum) {
    $("body").attr("class",songNum);
  }
}