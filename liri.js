
var twKeys = require('./keys');
var Twitter = require('twitter');
var spotify = require('spotify');

var defaultScreenName = 'chinlong';
var defaultSong = 'The Sign';
var defaultMovie = 'Mr. Nobody';

//myTweets();
spotifyThisSong('dancing in the moonlight');
//spotifyThisSong(defaultSong);

function myTweets() {
	var twClient = new Twitter(twKeys.twitterKeys);
	var twParams = {screen_name: defaultScreenName, count: 20};
	twClient.get('statuses/user_timeline', twParams, function(error, tweets, response) {
  		if (error) {
    		return console.error(error);
  		}

  		tweets.forEach(function(tweet) {
  			console.log(tweet.created_at + ':');
  			console.log('  ' + tweet.text);
  		});
	});
};

function spotifyThisSong(song) {

	debugger;
	spotify.search({ type: 'track', query: song}, function(err, data) {
    	if (err) {
    	    console.log('Error occurred: ' + err);
     	   return;
    	}

    	thisSong = data.tracks.items.filter(function(item) {
    		return item.name.toLowerCase() === song.toLowerCase();
    	});
 
    	if (thisSong.length > 0) {
    		thisSong.forEach(function(obj) {
    			displayThisSong(song, obj);
    		});
    		//console.log('length: ' + thisSong.length);
    	} else {
    		console.log('Invalid return data: No song found');
    	};
	});

}

function displayThisSong(song, obj) {
	// Extract artist's name(s)
	// There could be more than one artist
	var artists = obj.artists.map(function(artist) {
		return artist.name;
	});

	console.log('spotify-this-song,"' + song + '"');
	console.log('----------------------------------');
	console.log('Artist(s): ' + artists.join(', '));
	console.log('Name: ' + obj.name);
	console.log('Preview: ' + obj.preview_url);
	console.log('Album: ' + obj.album.name);
	console.log('==================================');
}