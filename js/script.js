
var player;
var songNum = 0;
var songs = [];
songs[0] = new song ("Suzanne Kraft","No Worries (Secret Circuit Professional Gold Mix)","AtyOo0OePPA","1FTn5osUbCr8n7WgYmbK5m","160336", "https://f4.bcbits.com/img/a2725264209_10.jpg")
songs[1] = new song ("Young Marco","Psychotic Particle","8J47f2om1zs","7zpN81tVvPwlHcJSkSCyRa","163743","http://redlightradio.net/wp-content/uploads/2016/06/Young-Marco-2015-3.jpg");
songs[2] = new song ("Maceo Plex","Polygon Pulse", "NHjDC0dMDv8", "3TXQ1ddouwQAI78hV4hXDj", "22656", "https://www.residentadvisor.net/images/events/flyer/2015/4/uk-0404-683022-496487-front.jpg" );
songs[3] = new song ("Fort Romeau","Saku", "H0iKVNwpk8Y", "5MKqWyqq5CStK7AhkTvzQF", "178049", "http://scontent.cdninstagram.com/t51.2885-15/e35/17333260_402281090132204_5352682402290335744_n.jpg?ig_cache_key=MTQ3MjY1MDkxNTc5MzM2OTQ5MA%3D%3D.2" );
songs[4] = new song ("Anatolian Weapons","A Strange Light From The East", "LsayLmUAPeE", "2xprJuO9NOXzoLQXlED6oT", "178049", "https://f4.bcbits.com/img/0006174563_10.jpg" );
songs[songNum].changeBg("song" + songNum);
songs[songNum].changeEvents();
// songs[songNum].changeRelated();


// Loads initial song to be played 
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    videoId: songs[songNum].youtubeId,
    events: {
      // 'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
  $("#songName").html("<h2 id=artistname>" + songs[songNum].artist + "</h2></br><h3 id=songtitle>" + songs[songNum].title + "</h3>");
}

// Loads next track when current song has finished playing
function onPlayerStateChange(e) {

  if (e.data == 0) {
    nextSong();
  }
}

// Fires when play button is clicked
var playButton = $("#play-button");
playButton.on("click", function() {
  player.playVideo();
  $(this).animate({
    opacity: "toggle"}, 450, function() {
      $(this).hide().fadeOut(function() {
        pauseButton.show();
      });
    });
});

// Fires when pause button is clicked  
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
  
// Hides youtube video and html5 player
$("#player").hide();
$("audio").hide();

// Obtains screen height and makes CSS adjustments
var screenHeight = screen.height;
$('body').css({'padding-top': screenHeight/2});
$('#main').css('min-height', screenHeight);
// $('body').css('min-height', screenHeight);


var spotifyApi = new SpotifyWebApi();
var artistId = songs[songNum].spotifyId;
var audio = $('#spotifyPlayer');

// $('.preview').on('click.toggle', function (e) {
//     if (!audio.paused) {
//         audio.pause();
//     } else {
//         audio.play();
//     }
//     $(this).toggleClass('paused');
//  });

// Plays Spotify preview of related artists when play button next to artist name is clicked
// If spotify preview is currently playing, pause it
$("#related").click(function(e) {
  var theTarget = $(e.target);
  console.log(theTarget);
  if (!audio.paused) {
    theTarget.attr('src', "img/pause.png")
    audio[0].pause();
  } else {
    theTarget.attr('src', "img/play.png")
    audio.play();
  }
  
});

loadTrack = function(artistId) {
  spotifyApi.getArtistTopTracks(artistId, 'US', 
    function(err, d){
      var previewUrl = d.tracks[0].preview_url;
      audio.attr("src",previewUrl);
      player.pauseVideo();
      audio[0].play();
      var albumArt = d.tracks[0].album.images[0].url;
      // $("body").css("backgroundImage","url('" + albumArt + "')");
    })
};

var shows = $("#showList");
var msg = "";

// Constructor for song objects
function song (artist, title, youtubeId, spotifyId, seatgeekId, bgImage) {
  this.liked = false,
  this.hated = false,
  this.artist = artist,
  this.title = title,
  this.youtubeId = youtubeId,
  this.spotifyId = spotifyId,
  this.seatgeekId = seatgeekId,
  this.changeBg = function (songNum) {
    $("body").attr("class",songNum);
  },
  // on song change, updates related artists from Spotify API
  this.changeRelated = function () {
    artistId = songs[songNum].spotifyId;
    $("#relatedList").text('');
    spotifyApi.getArtistRelatedArtists(artistId, 
      function(err, d){
        var relatedArtists = d.artists;
        for (var i=0;i<5;i++) {
            $("#relatedList").append("<li>" + relatedArtists[i].name + "<img src=img/play.png class=preview onclick=\"loadTrack('" + relatedArtists[i].id + "')\"></li>");
          };
      })
  },
  // on song change, updates upcoming events from Seat Geek
  this.changeEvents = function () {
    $.get("https://api.seatgeek.com/2/events?performers.id=" + songs[songNum].seatgeekId + "&client_id=NzE4ODI2NHwxNDkwODc2MTA0Ljk5", function(d) {   
      var msg = '';
      $("#showList").html(msg);
      for (var i = 0; i<d.events.length; i++) {
        msg += "<li>"
        msg += "<h3>" + d.events[i].datetime_local.slice(0,10) + "</h3>";
        msg += "<h2>" + d.events[i].title + "</h2>";
        msg += "<h3>Average price $" + d.events[i].stats.average_price;
        msg += " <a href=" + d.events[i].url + " target=_blank>Buy now</a>" + "</h3>";
        msg += "</li>";
        };
        $("#showList").html(msg);
})}
}

// moves to next song in songs array
function nextSong() {
  songNum += 1;
  if (songNum >= songs.length) {
    songNum = 0;
    console.log(songNum);
    player.loadVideoById(songs[songNum].youtubeId);
    songs[songNum].changeBg("song" + songNum);
    songs[songNum].changeRelated();
    songs[songNum].changeEvents();
    $("#songName").html("<h2 id=artistname>" + songs[songNum].artist + "</h2></br><h3 id=songtitle>" + songs[songNum].title + "</h3>");
  } else {
    console.log(songNum);
    player.loadVideoById(songs[songNum].youtubeId);
    songs[songNum].changeBg("song" + songNum);
    songs[songNum].changeRelated();
    songs[songNum].changeEvents();
    $("#songName").html("<h2 id=artistname>" + songs[songNum].artist + "</h2></br><h3 id=songtitle>" + songs[songNum].title + "</h3>");
  }  
}

// moves to previous song in songs array
function prevSong() {
    if (songNum === 0) {
    songNum = songs.length - 1;
    console.log(songNum);
    player.loadVideoById(songs[songNum].youtubeId);
    songs[songNum].changeBg("song" + songNum);
    songs[songNum].changeRelated();
    songs[songNum].changeEvents();
    $("#songName").html("<h2 id=artistname>" + songs[songNum].artist + "</h2></br><h3 id=songtitle>" + songs[songNum].title + "</h3>");
  } else {
    songNum -= 1;
    console.log(songNum);
    player.loadVideoById(songs[songNum].youtubeId);
    songs[songNum].changeBg("song" + songNum);
    songs[songNum].changeRelated();
    songs[songNum].changeEvents();
    $("#songName").html("<h2 id=artistname>" + songs[songNum].artist + "</h2></br><h3 id=songtitle>" + songs[songNum].title + "</h3>");
  }  
}

// AJAX call to search for seat geek artist ID
// $.get("https://api.seatgeek.com/2/performers?q=lolitas&client_id=NzE4ODI2NHwxNDkwODc2MTA0Ljk5", function(d) {
//   console.log(d);
// });
