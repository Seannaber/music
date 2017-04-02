var player;
var songNum = 0;
var songs = [];
songs[0] = new song ("Suzanne Kraft","No Worries (Secret Circuit Professional Gold Mix)","6OfmeAz1sJQ","1FTn5osUbCr8n7WgYmbK5m","160336", "https://f4.bcbits.com/img/a2725264209_10.jpg")
songs[1] = new song ("Young Marco","Psychotic Particle","8J47f2om1zs","7zpN81tVvPwlHcJSkSCyRa","163743","http://hyponik.com/wp-content/uploads/2014/09/YoungMarco_Hyponikbanner_RWalsh.jpg");
songs[2] = new song ("Maceo Plex","Polygon Pulse", "NHjDC0dMDv8", "3TXQ1ddouwQAI78hV4hXDj", "22656", "https://www.residentadvisor.net/images/events/flyer/2015/4/uk-0404-683022-496487-front.jpg" );
songs[3] = new song ("Fort Romeau","Saku", "H0iKVNwpk8Y", "5MKqWyqq5CStK7AhkTvzQF", "178049", "http://scontent.cdninstagram.com/t51.2885-15/e35/17333260_402281090132204_5352682402290335744_n.jpg?ig_cache_key=MTQ3MjY1MDkxNTc5MzM2OTQ5MA%3D%3D.2" );
songs[4] = new song ("Anatolian Weapons","A Strange Light From The East", "LsayLmUAPeE", "2xprJuO9NOXzoLQXlED6oT", "178049", "http://weownthenitenyc.com/wp-content/uploads/2016/05/We-Own-The-Nite-NYC_Maceo-Plex.jpg" );
songs[songNum].changeEvents();
// songs[songNum].changeRelated();


// Loads initial song to be played 
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    videoId: songs[songNum].youtubeId,
    events: {
      'onReady': function() {
        songs[songNum].changeEvents();
        songs[songNum].changeRelated();
      },
      'onStateChange': function(e) {
        updateBar();
        onPlayerStateChange(e);
      }
    }
  });
  $("#songName").html("<h2 id=artistname>" + songs[songNum].artist + "</h2></br><h3 id=songtitle>" + songs[songNum].title + "</h3>");
}

// Loads next track when current song has finished playing
function onPlayerStateChange(e) {
  vidPlayerState = e.data;
  if (vidPlayerState === 0) {
    ctx.clearRect(0, 0, 300, 300);
    nextSong();
  }
}

// Fires when play button is clicked
var playButton = $("#play-button");
playButton.on("click", function() {
  audio[0].pause();
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
  audio[0].pause();
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
// $('body').css({'padding-top': screenHeight/2});
$('#main').css('min-height', screenHeight);
// $('body').css('min-height', screenHeight);
// $("#iconMenu ul").css('margin-top', screenHeight/2);
// $("#iconMenu ul").css('position', 'absolute').css('bottom', 30);


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
// $("#related").click(function(e) {
//   var theTarget = $(e.target);
//   console.log(theTarget);
//   if (!audio.paused) {
//     theTarget.attr('src', "img/pause.png")
//     audio[0].pause();
//   } else {
//     theTarget.attr('src', "img/play.png")
//     audio.play();
//   }
  
// });

loadTrack = function(artistId) {
  spotifyApi.getArtistTopTracks(artistId, 'US', 
    function(err, d){
      var previewUrl = d.tracks[0].preview_url;
      audio.attr("src",previewUrl);
      player.pauseVideo();
      audio[0].play();
      if (vidPlayerState === 1) {
        pauseButton.animate({
        opacity: "toggle"}, 450, function() {
          $(this).hide().fadeOut(function() {
            playButton.show();
          });
        });
      }

        // var albumArt = d.tracks[0].album.images[0].url;
        // $("body").css("backgroundImage","url('" + albumArt + "')");
      })
};

// pauseTrack = function(e) {
//   audio[0].pause();
//   pauseButton.animate({
//       opacity: "toggle"}, 450, function() {
//         $(this).hide().fadeOut(function() {
//           playButton.show();
//         });
//       });
// }

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
  // on song change, updates background
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
        for (var i=0;i<15;i++) {
            $("#relatedList").append("<li>" + relatedArtists[i].name + "<img src=img/play.png class=preview onclick=\"loadTrack('" + relatedArtists[i].id + "')\"></li>");
          };
      })
  },
  // on song change, updates upcoming events from Seat Geek
  this.changeEvents = function () {
    $.get("https://api.seatgeek.com/2/events?performers.id=" + songs[songNum].seatgeekId + "&client_id=NzE4ODI2NHwxNDkwODc2MTA0Ljk5", function(d) {   
      var msg = '';
      $("#showList").html(msg);
      if (d.events.length === 0) {
        $("#showList").html("<li>No upcoming performances...</li>");
      } else {
      for (var i = 0; i<d.events.length; i++) {
        msg += "<li>"
        msg += "<h3>" + d.events[i].datetime_local.slice(0,10) + "</h3>";
        msg += "<h2>" + d.events[i].title + "</h2>";
        msg += "<h3>Average price $" + d.events[i].stats.average_price;
        msg += " <a href=" + d.events[i].url + " target=_blank>Buy now</a>" + "</h3>";
        msg += "</li>";
        };
        $("#showList").html(msg);
      }
})}
}

// moves to next song in songs array
function nextSong() {
  ctx.clearRect(0, 0, 300, 300);
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
    ctx.clearRect(0, 0, 300, 300);
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

var shuffle = false;

// switch statement to handle clicks on like/hate/shuffle/viewVid icons
$("#iconMenu ul li").click(function(e) {
  console.log($(this));
  switch ($(this).attr('id')) {
    case "like":
      songs[songNum].hated = false;
      songs[songNum].liked = !songs[songNum].liked;
      $(this).children().toggleClass("activeIconHeart").toggleClass("icons");
      break;
    case "hate":
      songs[songNum].liked = false;
      songs[songNum].hated = !songs[songNum].hated;
      $(this).children().toggleClass("activeIcon").toggleClass("icons");
      break;
    case "shuffle":
      shuffle = !shuffle; 
      $(this).children().toggleClass("activeIcon").toggleClass("icons");
      break;
    case "viewVid":
      $("#player").toggle();
      $(this).children().toggleClass("activeIcon").toggleClass("icons");
      break;
  }
});

$(".main").onepage_scroll({
   sectionContainer: "section",     // sectionContainer accepts any kind of selector in case you don't want to use section
   easing: "ease",                  // Easing options accepts the CSS3 easing animation such "ease", "linear", "ease-in",
                                    // "ease-out", "ease-in-out", or even cubic bezier value such as "cubic-bezier(0.175, 0.885, 0.420, 1.310)"
   animationTime: 1000,             // AnimationTime let you define how long each section takes to animate
   pagination: true,                // You can either show or hide the pagination. Toggle true for show, false for hide.
   updateURL: false,                // Toggle this true if you want the URL to be updated automatically when the user scroll to each page.
   beforeMove: function(index) {},  // This option accepts a callback function. The function will be called before the page moves.
   afterMove: function(index) {},   // This option accepts a callback function. The function will be called after the page moves.
   loop: false,                     // You can have the page loop back to the top/bottom when the user navigates at up/down on the first/last page.
   keyboard: true,                  // You can activate the keyboard controls
   responsiveFallback: false,        // You can fallback to normal page scroll by defining the width of the browser in which
                                    // you want the responsive fallback to be triggered. For example, set this to 600 and whenever
                                    // the browser's width is less than 600, the fallback will kick in.
   direction: "vertical"            // You can now define the direction of the One Page Scroll animation. Options available are "vertical" and "horizontal". The default value is "vertical".  
});

// AJAX call to search for seat geek artist ID
// $.get("https://api.seatgeek.com/2/performers?q=lolitas&client_id=NzE4ODI2NHwxNDkwODc2MTA0Ljk5", function(d) {
//   console.log(d);
// });

// Testing discogs API
// $.get("https://api.discogs.com/artists/1626911", function(d) {
//   console.log(d);
// });

// Testing Blitzr API
// $.get("https://api.blitzr.com/radio/artist/?uuid=spotify:1jBkXf5NwyxgbUw9fWxAOE&key=7f643b85049c768c1727dbeaf587f824", function(d) {
//   console.log(d);
// });