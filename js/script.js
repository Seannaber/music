var player;
var songNum = 0;
var songs = [];
songs[0] = new song ("Suzanne Kraft","Crest","bl_PD-YlboI", "https://f4.bcbits.com/img/a2725264209_10.jpg",58,34,33,88)
songs[1] = new song ("Fatima Yamaha","What's a Girl to Do","610DgdLgsrg","http://hyponik.com/wp-content/uploads/2014/09/YoungMarco_Hyponikbanner_RWalsh.jpg",69,62,46,67);
songs[2] = new song ("Pional","Its All Over (Locked Groove Rendition)", "I05JazGbYZg", "http://content.acclaimmag.com/content/uploads/2016/09/pional-1.jpg",78,64,33,78 );
songs[3] = new song ("Fort Romeau","K.O.N.T.R.O.L.", "GFcW7hN8AOQ", "http://scontent.cdninstagram.com/t51.2885-15/e35/17333260_402281090132204_5352682402290335744_n.jpg?ig_cache_key=MTQ3MjY1MDkxNTc5MzM2OTQ5MA%3D%3D.2",77,54,45,89 );
songs[4] = new song ("Todd Terje","Swing Star Part 1", "SCtd_Mw7cFY", "http://filtermexico.com/wp-content/uploads/2013/07/Todd-Terje-2.jpg",69,71,57,59 );
songs[songNum].changeEvents();

// Loads initial song to be played 
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    videoId: songs[songNum].youtubeId,
    events: {
      'onReady': function() {
        setSpotifyId();
        setSevenDigitalId();
        setSongKickId();
        songs[songNum].changeEvents();
        songs[songNum].changeRelated();
        songs[songNum].getBio();
        songs[songNum].changePurchases();
        delayedChart();
        nowPlaying();
        nameDNA();
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
var playButtonMini = $("#play-button-mini");
playButtonMini.on("click", function() {
  audio[0].pause();
  player.playVideo();
  $(this).animate({
    opacity: "toggle"}, 450, function() {
      $(this).hide().fadeOut(function() {
        playButton.hide();
        pauseButton.show();
        pauseButtonMini.show();
      });
    });
});

// Fires when pause button is clicked  
var pauseButtonMini = $("#pause-button-mini");
pauseButtonMini.on("click", function() {
  audio[0].pause();
  player.pauseVideo();
  $(this).animate({
    opacity: "toggle"}, 450, function() {
      $(this).hide().fadeOut(function() {
        pauseButton.hide();
        playButton.show();
        playButtonMini.show()
      });
    });
});

// Fires when mini play button is clicked
var playButton = $("#play-button");
playButton.on("click", function() {
  audio[0].pause();
  player.playVideo();
  $(this).animate({
    opacity: "toggle"}, 450, function() {
      $(this).hide().fadeOut(function() {
        playButtonMini.hide();
        pauseButtonMini.show();
        pauseButton.show();
      });
    });
});

// Fires when mini pause button is clicked  
var pauseButton = $("#pause-button");
// pauseButton.hide();
pauseButton.on("click", function() {
  audio[0].pause();
  player.pauseVideo();
  $(this).animate({
    // height: 400,
    opacity: "toggle"}, 450, function() {
      $(this).hide().fadeOut(function() {
        pauseButtonMini.hide();
        playButtonMini.show();
        playButton.show();
      });
    });
});
  
// Hides youtube video and html5 player
$("#player").hide();
$("audio").hide();
$("#miniPlayer").hide();
pauseButtonMini.hide();

// Obtains screen height and makes CSS adjustments
var screenHeight = screen.height;
$('#main').css('min-height', screenHeight);

var spotifyApi = new SpotifyWebApi();
var artistId = songs[songNum].spotifyId;
var audio = $('#spotifyPlayer');

// Plays Spotify preview of related artists when play button next to artist name is clicked
// If spotify preview is currently playing, pause it
$("#related").click(function(e) {
  var theTarget = $(e.target);
  var artistId = theTarget.attr("id");
  console.log(theTarget);
  if (theTarget.attr("src") === "img/play.png") {
    theTarget.attr("src","img/pause.png");
    spotifyApi.getArtistTopTracks(artistId, 'US', 
      function(err, d){
        var previewUrl = d.tracks[0].preview_url;
        audio.attr("src",previewUrl);
        player.pauseVideo();
        audio[0].play();
        var playButtons = $("#related img.preview");
        playButtons.each(function(i) {
          if ($(this).attr("id") !== artistId) {
            $(this).attr("src","img/play.png");
          }
        });
        if (vidPlayerState === 1) {
        pauseButton.animate({
        opacity: "toggle"}, 450, function() {
          $(this).hide().fadeOut(function() {
            playButton.show();
          });
        });
        pauseButtonMini.animate({
        opacity: "toggle"}, 450, function() {
          $(this).hide().fadeOut(function() {
            playButtonMini.show();
          });
        });
      }
      });
  } else if (artistId.length > 0) {
    theTarget.attr("src","img/play.png");
    audio[0].pause();
}});

// sets spotify ID for all songs
setSpotifyId = function() {
  for (var i=0; i<songs.length; i++) {
    $.ajax({
      url: "https://api.spotify.com/v1/search?q=" + songs[i].artist + "&type=artist",
      async: false,
      success: function(d) {
        songs[i].spotifyId = d.artists.items[0].id;
      }
    }) 
  }
};

// sets songkick ID for all songs
var kickIds = [];
setSongKickId = function() {
  for (var i=0; i<songs.length; i++) {
    $.ajax({
      url: "https://api.songkick.com/api/3.0/search/artists.json?query=" + songs[i].artist + "&apikey=y2QamR9aQjPzpsYs&jsoncallback=?",
      async: false,
      dataType: "JSONP",
      success: function(d) {
        var result = d.resultsPage.results.artist[0].id;
        kickIds.push(result);
      }
    }).then(function() {
      for (var i=0; i<songs.length; i++) {
        songs[i].songKickId = kickIds[i];
      }
    }); 
  }
};

// sets 7digital ID for all songs
setSevenDigitalId = function() {
  for (var i=0; i<songs.length; i++) {
    $.ajax({
      url: "http://api.7digital.com/1.2/artist/search?q=" + songs[i].artist + "&sort=score%20desc&country=ww&oauth_consumer_key=7dyu4vag3h4k&oauth_consumer_secret=9acf9s3ad8eem4f5",
      async: false,
      dataType: "json",
      success: function(d) {
        songs[i].sevenDigitalId = d.searchResults.searchResult["0"].artist.id;
      }
    }) 
  }
};

// updates artist/title in mini player
nowPlaying = function() {
  var msg = songs[songNum].artist + " - " + songs[songNum].title
  console.log(msg.length);
  if (msg.length > 40) {
    msg = msg.substring(0,40) + "...";
    $("#nowPlaying").html(msg);
  } else {
  $("#nowPlaying").html(songs[songNum].artist + " - " + songs[songNum].title);
}}

// misc variable declarations
var shows = $("#showList");
var msg = "";

// Constructor for song objects
function song (artist, title, youtubeId, bgImage, stat1, stat2, stat3, stat4) {
  this.liked = false,
  this.hated = false,
  this.artist = artist,
  this.title = title,
  this.youtubeId = youtubeId,
  this.spotifyId = "",
  this.seatgeekId = "",
  this.danceability = stat1,
  this.energy = stat2,
  this.valence = stat3,
  this.instru = stat4,
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
        // console.log(d);
        var relatedArtists = d.artists;
        for (var i=0;i<5;i++) {
            $("#relatedList").append("<li><img height=100 src=" + d.artists[i].images[0].url + ">" + relatedArtists[i].name + "<img src=img/play.png class=preview id=" + relatedArtists[i].id + "></li>");
          };
      });
  },

  // on song change, updates upcoming events from Seat Geek
  this.changeEvents = function () {
    $.getJSON("http://api.songkick.com/api/3.0/events.json?apikey=y2QamR9aQjPzpsYs&artist_name=" + songs[songNum].artist + "&jsoncallback=?", function(d) {   
      var msg = '';
      $("#showList").html(msg);
      if (d.resultsPage.totalEntries === 0) {
        $("#showList").html("<li>Sorry, this artist has no upcoming performances.</li>");
      } else {
      for (var i = 0; i<2; i++) {
        msg += "<li>"
        msg += "<h1>" + d.resultsPage.results.event[i].location.city + "</h1>";
        msg += "<h2>" + d.resultsPage.results.event[i].start.date + "</h2>";
        msg += "<h2>" + d.resultsPage.results.event[i].displayName + "</h2>";
        msg += "<a href=" + d.resultsPage.results.event[i].uri + " target=_blank><button class=downloadButton><span class='glyphicon glyphicon-info-sign'></span> More info</button></a>";
        msg += "</li>";
        };
        $("#showList").html(msg);
      }
})},
    // obtains artist bio from last.fm
    this.getBio = function () {
      $.get("http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + songs[songNum].artist + "&api_key=ef4bf194f0542ed37c6d13c45aa93b0f&format=json", function(d) { 
        $("#bioText").html(d.artist.bio.content);
      })},
    // updates artist stats d3 charts
    this.drawChart = function () {
      $("chart1").html('');
      $("chart2").html('');
      $("chart3").html('');
      $("chart4").html('');
      artistStats1.update(parseInt((this.danceability * 100).toFixed(0)));
      artistStats2.update(parseInt((this.energy * 100).toFixed(0)));
      artistStats3.update(parseInt((this.valence * 100).toFixed(0)));
      artistStats4.update(parseInt((this.instru * 100).toFixed(0)));
    },
    // updates available purchases
    this.changePurchases = function () {
    $.getJSON("http://api.7digital.com/1.2/artist/releases?artistid=" + songs[songNum].sevenDigitalId + "&country=ww&imageSize=350&type=album&oauth_consumer_key=7dyu4vag3h4k&oauth_consumer_secret=9acf9s3ad8eem4f5", function(d) {
          var msg = '';
          for (var i=0; i<d.length || i<3; i++) {
              
              msg += "<li>"
              msg += "<img src=" + d.releases.releases[i].image + "></img>";
              msg += "<h1>" + songs[songNum].artist + "</h1>";
              msg += "<h2>" + d.releases.releases[i].title + "</h2>";
              msg += "<a href=" + d.releases.releases[i].url + " target=_blank><button class=downloadButton><span class='glyphicon glyphicon-cloud-download'></span> " + d.releases.releases[i].price.formattedPrice + "</button></a>";
              msg += "</li>";
          };
          $("#buyList").html(msg);

});
  }
}

// changes artist name on stats page
function nameDNA() {
  $("#nameDNA").text(songs[songNum].artist);
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
    songs[songNum].getBio();
    songs[songNum].changePurchases();
    drawChart();   
    nowPlaying(); 
    nameDNA();
    $("#songName").html("<h2 id=artistname>" + songs[songNum].artist + "</h2></br><h3 id=songtitle>" + songs[songNum].title + "</h3>");
  } else {
    player.loadVideoById(songs[songNum].youtubeId);
    songs[songNum].changeBg("song" + songNum);
    songs[songNum].changeRelated();
    songs[songNum].changeEvents();
    songs[songNum].getBio();
    songs[songNum].changePurchases();
    drawChart();
    nowPlaying(); 
    nameDNA();
    $("#songName").html("<h2 id=artistname>" + songs[songNum].artist + "</h2></br><h3 id=songtitle>" + songs[songNum].title + "</h3>");
  }  
}

// moves to previous song in songs array
function prevSong() {
    ctx.clearRect(0, 0, 300, 300);
    if (songNum === 0) {
    songNum = songs.length - 1;
    player.loadVideoById(songs[songNum].youtubeId);
    songs[songNum].changeBg("song" + songNum);
    songs[songNum].changeRelated();
    songs[songNum].changeEvents();
    songs[songNum].getBio();
    songs[songNum].changePurchases();
    drawChart();
    nowPlaying();
    nameDNA();
    $("#songName").html("<h2 id=artistname>" + songs[songNum].artist + "</h2></br><h3 id=songtitle>" + songs[songNum].title + "</h3>");
  } else {
    songNum -= 1;
    player.loadVideoById(songs[songNum].youtubeId);
    songs[songNum].changeBg("song" + songNum);
    songs[songNum].changeRelated();
    songs[songNum].changeEvents();
    songs[songNum].getBio();
    songs[songNum].changePurchases();
    drawChart();
    nowPlaying();
    nameDNA();
    $("#songName").html("<h2 id=artistname>" + songs[songNum].artist + "</h2></br><h3 id=songtitle>" + songs[songNum].title + "</h3>");
  }  
}

var shuffle = false;

// switch statement to handle clicks on like/hate/shuffle/viewVid icons
$("#iconMenu ul li").click(function(e) {
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
      $("#hideVid, #player").toggle();
      break;
    case "info":
      $("#hideBio, #bio").toggle();
      break;
  }
});

// handles onclick() call when clicking nav arrows
toPage = function(num) {
  $("body").removeClass("viewing-page-" + (num - 1));
  $("body").addClass("viewing-page-" + num);
  $("this").moveTo(num);
  // if (num > 1) {
  //   $("#miniPlayer").show();
  // } else {
  //   $("#miniPlayer").hide()
  // }
};

// Settings for onepage scroll plugin
$(".main").onepage_scroll({
   sectionContainer: "section",     // sectionContainer accepts any kind of selector in case you don't want to use section
   easing: "ease",                  // Easing options accepts the CSS3 easing animation such "ease", "linear", "ease-in",
                                    // "ease-out", "ease-in-out", or even cubic bezier value such as "cubic-bezier(0.175, 0.885, 0.420, 1.310)"
   animationTime: 1000,             // AnimationTime let you define how long each section takes to animate
   pagination: false,                // You can either show or hide the pagination. Toggle true for show, false for hide.
   updateURL: false,                // Toggle this true if you want the URL to be updated automatically when the user scroll to each page.
   beforeMove: function(index) {
    if ($("body").hasClass("viewing-page-1")) {
      $("#miniPlayer").hide();
    } else {
      $("#miniPlayer").show();
    }

   },  // This option accepts a callback function. The function will be called before the page moves.
   afterMove: function(index) {
   },   // This option accepts a callback function. The function will be called after the page moves.
   loop: false,                     // You can have the page loop back to the top/bottom when the user navigates at up/down on the first/last page.
   keyboard: true,                  // You can activate the keyboard controls
   responsiveFallback: false,        // You can fallback to normal page scroll by defining the width of the browser in which
                                    // you want the responsive fallback to be triggered. For example, set this to 600 and whenever
                                    // the browser's width is less than 600, the fallback will kick in.
   direction: "horizontal"            // You can now define the direction of the One Page Scroll animation. Options available are "vertical" and "horizontal". The default value is "vertical".  
});


// onboarding overlay
$("#onboard").hide().delay(1000).fadeIn(1000);
$("#hideOnboard").click(function() {
  $("#onboard").toggle()
})

// hides/shows artist bio information
$("#bio").hide();
$("#hideBio").hide();
$("#hideBio").click(function() {
  $("#bio, #hideBio").toggle();
});



showBio = function() {
  $("#menu").css('right', '105%');
  $(".main").css('left', '0%');
  $("#bio, #hideBio").toggle();
}

// hides vid unless eyeball icon is clicked
$("#hideVid").hide();
$("#hideVid").click(function() {
  $("#player, #hideVid").toggle();
});

$("#toPage2").click(function() {
  $("body").removeClass("viewing-page-1").addClass("viewing-page-2");
});

// handles behavior of menu when icon clicked
$("#menu").css('right', '105%');
$(".mobileMenu").click(function() {
  $("#menu").css('right', '60%');
  $(".main").css('left', '40%');
});

// hides menu when X is clicked
$("#hideMenu").click(function() {
  $("#menu").css('right', '105%');
  $(".main").css('left', '0%');
});

// navigates to selected page in menu, shifts menu and site back to normal
$("#menu").click(function(e) {
  if (e.target.id) {
    $("#menu").css('right', '105%');
    $(".main").css('left', '0%');
    toPage(e.target.id).delay(1000);
    
}});

// d3 charting section
function delayedChart() {
  setTimeout(drawChart, 200);
}

var artistStats1 = new RadialProgressChart('#chart1', {
  series: [{
    value: parseInt((songs[songNum].danceability).toFixed(0)),
    color: ['red', '#7CFC00']
  }],
  center: function(d) {
    return parseInt((songs[songNum].danceability).toFixed(0))
  }
});

var artistStats2 = new RadialProgressChart('#chart2', {
  series: [{
    value: parseInt((songs[songNum].energy).toFixed(0)),
    color: ['green', '#7CFC00']
  }],
  center: function(d) {
    return parseInt((songs[songNum].energy).toFixed(0))
  }
});

var artistStats3 = new RadialProgressChart('#chart3', {
  series: [{
    value: parseInt((songs[songNum].valence).toFixed(0))
  }],
  center: function(d) {
    return parseInt((songs[songNum].valence).toFixed(0))
  }
});

var artistStats4 = new RadialProgressChart('#chart4', {
  series: [{
    value: parseInt((songs[songNum].instru).toFixed(0)),
    color: ['orange', '#fcbd00']
  }],
  center: function(d) {
    return parseInt((songs[songNum].instru).toFixed(0))
  }
});


// var artistStats1 = new RadialProgressChart('#chart1', 
//   {series: [parseInt((songs[songNum].danceability).toFixed(0))], 
//    center: function() {
//         return parseInt((songs[songNum].danceability).toFixed(0))
//       }});
   //    var artistStats2 = new RadialProgressChart('#chart2', {series: [parseInt((songs[songNum].energy).toFixed(0))], 
   // center: function() {
   //      return parseInt((songs[songNum].energy).toFixed(0))
   //    }});
   //    var artistStats3 = new RadialProgressChart('#chart3', {series: [parseInt((songs[songNum].valence).toFixed(0))], 
   // center: function() {
   //      return parseInt((songs[songNum].valence).toFixed(0))
   //    }});
   //    var artistStats4 = new RadialProgressChart('#chart4', {series: [parseInt((songs[songNum].instru).toFixed(0))], 
   // center: function() {
   //      return parseInt((songs[songNum].instru).toFixed(0))
   //    }});

function drawChart() {
      artistStats1.update(songs[songNum].danceability);
      artistStats2.update(songs[songNum].energy);
      artistStats3.update(songs[songNum].valence);
      artistStats4.update(songs[songNum].instru);
    }

// misc variable declarations
var topTracks = [];
var topTracksStats = [];
var topTracksStatsAvg = [];

var text = "beech.fm";

for(var i in text) { 
  if(text[i] === " ") {
    $(".wavetext").append( $("<span>").html("&nbsp;") ); 
  } else {  
    $(".wavetext").append( $("<span>").text(text[i]) ); 
  }
}

// Various AJAX calls to obtain artist information. Keeping here just in case I need it later

// Testing discogs API
// $.get("https://api.discogs.com/artists/1626911", function(d) {
//   console.log(d);
// });

//Testing songkick API
// $.getJSON("http://api.songkick.com/api/3.0/events.json?apikey=y2QamR9aQjPzpsYs&artist_name=" + songs[2].artist + "&jsoncallback=?", function(d) {
//   console.log(d.resultsPage.results.event["0"].displayName);
// });

// $.getJSON("http://api.7digital.com/1.2/artist/releases?artistid=" + songs[1].SevenDigitalId + "&country=ww&oauth_consumer_key=7dyu4vag3h4k&oauth_consumer_secret=9acf9s3ad8eem4f5", function(d) {
//   console.log(d);
//   console.log(songs[1].SevenDigitalId);
// });

// spotifyApi.getArtistTopTracks(songs[0].spotifyId, 
//       function(err, d){
//         console.log(d);
// });


// $.ajax({
//       url: "https://api.spotify.com/v1/artists/" + songs[songNum].spotifyId + "/top-tracks?country=US",
//       async: true,
//       success: function(d) {
//         console.log(d);
//         for (var i=0;i<d.tracks.length;i++) {
//           topTracks[i] = d.tracks[i].id;
//         }
//       }
//     });

 // $.ajax({
 //      url: "https://api.spotify.com/v1/audio-features?ids=" + topTracks[0] + "," + topTracks[1] + "?client_id=1f28c1aacefc4c559bc5673be94eb276",
 //      async: true,
 //      success: function(d) {
 //        console.log(d);
 //        for (var i=0;i<d.tracks.length;i++) {
 //          topTracks[i] = d.tracks[i].id;
 //        }
 //      }
 //    });

// spotifyApi.getAudioFeaturesForTracks(topTracks, function(err, d) {
//   console.log(d);
//   for (var i=0;i<10;i++) {
//     topTracksStats[i] = [d.audio_features[i].danceability,
//                         d.audio_features[i].energy,
//                         d.audio_features[i].valence,
//                         d.audio_features[i].instrumentalness
//                         ];
//   };
// });
