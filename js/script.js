var player;
var songNum = 0;
var songs = [];
songs[0] = new song ("Suzanne Kraft","No Worries (Secret Circuit Professional Gold Mix)","6OfmeAz1sJQ", "https://f4.bcbits.com/img/a2725264209_10.jpg")
songs[1] = new song ("Young Marco","Psychotic Particle","8J47f2om1zs","http://hyponik.com/wp-content/uploads/2014/09/YoungMarco_Hyponikbanner_RWalsh.jpg");
songs[2] = new song ("Maceo Plex","Polygon Pulse", "NHjDC0dMDv8", "https://www.residentadvisor.net/images/events/flyer/2015/4/uk-0404-683022-496487-front.jpg" );
songs[3] = new song ("Fort Romeau","Saku", "H0iKVNwpk8Y", "http://scontent.cdninstagram.com/t51.2885-15/e35/17333260_402281090132204_5352682402290335744_n.jpg?ig_cache_key=MTQ3MjY1MDkxNTc5MzM2OTQ5MA%3D%3D.2" );
songs[4] = new song ("Shit Robot","OB-8", "yrPZRtHpDjY", "http://www.playbackplayback.com/wp-content/uploads/2015/04/ShitRobot-940x940.jpg" );
songs[songNum].changeEvents();


// songs[songNum].changeRelated();


// Loads initial song to be played 
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    videoId: songs[songNum].youtubeId,
    events: {
      'onReady': function() {
        setSeatgeekId();
        setSpotifyId();
        setDiscogsId();
        setSevenDigitalId();
        songs[songNum].changeEvents();
        songs[songNum].changeRelated();
        songs[songNum].getBio();
        songs[songNum].changePurchases();
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
        var playButtons = $("#related img");
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
      }
      });
  } else {
    theTarget.attr("src","img/play.png");
    audio[0].pause();
}});



// $("#related").click(function(e) {
//   var theTarget = $(e.target);
//   var artistId = theTarget.attr("id");
//   console.log(artistId);
//   console.log(theTarget);
//   console.log('from related');
//   if ($("audio").paused) {
//     theTarget.attr('src', "img/play.png")
//     audio[0].pause();
//   } else {
//     theTarget.attr('src', "img/pause.png")
    // spotifyApi.getArtistTopTracks(artistId, 'US', 
    // function(err, d){
    //   var previewUrl = d.tracks[0].preview_url;
    //   audio.attr("src",previewUrl);
    //   player.pauseVideo();
    //   audio[0].play();
//   })}
  
// });


// loadTrack = function(artistId) {
//   console.log('from loadTrack');
//   spotifyApi.getArtistTopTracks(artistId, 'US', 
//     function(err, d){
//       var previewUrl = d.tracks[0].preview_url;
//       audio.attr("src",previewUrl);
//       player.pauseVideo();
//       audio[0].play();
      // if (vidPlayerState === 1) {
      //   pauseButton.animate({
      //   opacity: "toggle"}, 450, function() {
      //     $(this).hide().fadeOut(function() {
      //       playButton.show();
      //     });
      //   });
      // }

//         // var albumArt = d.tracks[0].album.images[0].url;
//         // $("body").css("backgroundImage","url('" + albumArt + "')");
//       })
// };

// pauseTrack = function(e) {
//   audio[0].pause();
//   pauseButton.animate({
//       opacity: "toggle"}, 450, function() {
//         $(this).hide().fadeOut(function() {
//           playButton.show();
//         });
//       });
// }
setSeatgeekId = function() {
  for (var i=0; i<songs.length; i++) {
    $.ajax({
      url: "https://api.seatgeek.com/2/performers?q=" + songs[i].artist + "&client_id=NzE4ODI2NHwxNDkwODc2MTA0Ljk5",
      async: false,
      success: function(d) {
        songs[i].seatgeekId = d.performers[0].id;
      }
    }) 
  }
};

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

setDiscogsId = function() {
  for (var i=0; i<songs.length; i++) {
    $.ajax({
      url: "https://api.discogs.com/database/search?q=" + songs[i].artist + "&key=aZOluklbWLHcZCDcXMUt&secret=WphUDuSHgaomOzAiUmGBxUVwhRAXjnaR",
      async: false,
      success: function(d) {
        songs[i].discogsId = d.results[0].id;
      }
    }) 
  }
};

// setBlitzrId = function() {
//   for (var i=0; i<songs.length; i++) {
//     $.ajax({
//       url: "https://api.blitzr.com/search/artist/?key=7f643b85049c768c1727dbeaf587f824&query=" + songs[i].artist + "&limit=10&start=0",
//       async: false,
//       success: function(d) {
//         songs[i].blitzrId = d[0].uuid;
//       }
//     }) 
//   }
// };

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


var shows = $("#showList");
var msg = "";

// Constructor for song objects
function song (artist, title, youtubeId, bgImage) {
  this.liked = false,
  this.hated = false,
  this.artist = artist,
  this.title = title,
  this.youtubeId = youtubeId,
  this.spotifyId = "",
  this.seatgeekId = "",
  this.discogsId = "",
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
        for (var i=0;i<11;i++) {
            $("#relatedList").append("<li>" + relatedArtists[i].name + "<img src=img/play.png class=preview id=" + relatedArtists[i].id + "></li>");
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
})},
    this.getBio = function () {
      $.get("https://api.discogs.com/artists/" + songs[songNum].discogsId, function(d) { 
        $("#bioText").html(d.profile);
      })},
      this.updateAll = function () {
        this.changeBg(songNum);
        this.changeRelated();
        this.changeEvents();
        this.getBio();
  },
    this.changePurchases = function () {
    $.getJSON("http://api.7digital.com/1.2/artist/releases?artistid=" + songs[songNum].sevenDigitalId + "&country=ww&imageSize=350&oauth_consumer_key=7dyu4vag3h4k&oauth_consumer_secret=9acf9s3ad8eem4f5", function(d) {
          var msg = '';
          console.log(d);
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
    $("#songName").html("<h2 id=artistname>" + songs[songNum].artist + "</h2></br><h3 id=songtitle>" + songs[songNum].title + "</h3>");
  } else {
    player.loadVideoById(songs[songNum].youtubeId);
    songs[songNum].changeBg("song" + songNum);
    songs[songNum].changeRelated();
    songs[songNum].changeEvents();
    songs[songNum].getBio();
    songs[songNum].changePurchases();
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
    $("#songName").html("<h2 id=artistname>" + songs[songNum].artist + "</h2></br><h3 id=songtitle>" + songs[songNum].title + "</h3>");
  } else {
    songNum -= 1;
    player.loadVideoById(songs[songNum].youtubeId);
    songs[songNum].changeBg("song" + songNum);
    songs[songNum].changeRelated();
    songs[songNum].changeEvents();
    songs[songNum].getBio();
    songs[songNum].changePurchases();
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
      $(this).children().toggleClass("activeIcon").toggleClass("icons");
      break;
    case "info":
      $("#hideBio, #bio").toggle();
      break;
  }
});

toPage = function(num) {
  $("body").removeClass("viewing-page-" + (num - 1));
  $("body").addClass("viewing-page-" + num);
  $("this").moveTo(num);
};

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

$("#bio").hide();
$("#hideBio").hide();
$("#hideBio").click(function() {
  $("#bio, #hideBio").toggle();
});

$("#hideVid").hide();
$("#hideVid").click(function() {
  $("#player, #hideVid").toggle();
});

$("#toPage2").click(function() {
  $("body").removeClass("viewing-page-1").addClass("viewing-page-2");
});

$("#menu").css('right', '105%');
$(".mobileMenu").click(function() {
  $("#menu").css('right', '60%');
  $(".main").css('left', '40%');
});

$("#hideMenu").click(function() {
  $("#menu").css('right', '105%');
  $(".main").css('left', '0%');
});





// AJAX call to search for seat geek artist ID
// $.get("https://api.seatgeek.com/2/performers?q=lolitas&client_id=NzE4ODI2NHwxNDkwODc2MTA0Ljk5", function(d) {
//   console.log(d);
// });

// Testing discogs API
// $.get("https://api.discogs.com/artists/1626911", function(d) {
//   console.log(d);
// });

//Testing Blitzr API
// $.get("https://api.blitzr.com/buy/artist/mp3/?key=7f643b85049c768c1727dbeaf587f824&uuid=ARv88shncZqW3pWVVi", function(d) {
//   console.log(d);
// });

// $.get("https://api.blitzr.com/search/artist/?key=7f643b85049c768c1727dbeaf587f824&query=" + songs[0].artist + "&limit=10&start=0", function(d) {
//   console.log(d[0].uuid);
// });

//Testing MusicGraph API
// $.get("http://api.musicgraph.com/api/v2/artist/420df292-3005-2df6-8346-40adf5415964/metrics?api_key=a1f90e8c4b96ff2812961f6a9b815e1c", function(d) {
//   console.log(d);
// });

// http://api.mndigital.com/?method=search.gettracks&title=Come%20As%20You%20Are&artist=Nirvana

//Testing medianet API
// $.get("http://api.mndigital.com/?method=search.gettracks&artist=" + songs[0].artist + "&includeExplicit=true&page=1&pageSize=1&apiKey=kCvqrddKxR6OIMKhCE1nPo6KQ&format=json", function(d) {
//   console.log(d);
// });

// $.getJSON("http://api.7digital.com/1.2/artist/releases?artistid=" + songs[1].SevenDigitalId + "&country=ww&oauth_consumer_key=7dyu4vag3h4k&oauth_consumer_secret=9acf9s3ad8eem4f5", function(d) {
//   console.log(d);
//   console.log(songs[1].SevenDigitalId);
// });

// http://api.7digital.com/1.2/artist/releases?artistid=1&oauth_consumer_key=YOUR_KEY_HERE&country=GB&pagesize=2&usageTypes=download,subscriptionstreaming,adsupportedstreaming

// http://api.7digital.com/1.2/artist/search?q=pink&sort=score%20desc&country=US&oauth_consumer_key=YOUR_KEY_HERE&pagesize=2 

// &oauth_consumer_key=7dyu4vag3h4k