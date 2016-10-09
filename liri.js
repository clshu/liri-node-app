
var twKeys = require('./keys');
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');

var defaultScreenName = 'chinlong';
var defaultSong = 'The Sign';
var defaultMovie = 'Mr. Nobody';

//myTweets();
//spotifyThisSong('dancing in the moonlight');
//spotifyThisSong(defaultSong);
movieThis(defaultMovie);
//movieThis('unforgiven');

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
    	// There could be more than one track found
    	// Extract the ones with the same name
    	thisSong = data.tracks.items.filter(function(item) {
    		return item.name.toLowerCase() === song.toLowerCase();
    	});
 
    	if (thisSong.length > 0) {
    		console.log('spotify-this-song,"' + song + '"');
    		thisSong.forEach(function(songObj) {
    			displayThisSong(songObj);
    		});
  			console.log('==================================');
    		//console.log('length: ' + thisSong.length);
    	} else {
    		console.log('Invalid return data: No song found');
    	};
	});

}

function displayThisSong(obj) {
	// Extract artist's name(s)
	// There could be more than one artist
	var artists = obj.artists.map(function(artist) {
		return artist.name;
	});

	console.log('----------------------------------');
	console.log('Artist(s): ' + artists.join(', '));
	console.log('Name: ' + obj.name);
	console.log('Preview: ' + obj.preview_url);
	console.log('Album: ' + obj.album.name);
}

function movieThis(movieName) {
	var url = 'http://www.omdbapi.com/?t=' + movieName + '&tomatoes=true&y=&plot=short&r=json';

	request(url, function (error, response, body) {

		if (error) {
			return console.error(error);
		}

		if (response.statusCode == 200) {
			displayThisMovie(movieName, JSON.parse(body));
		} else {
			console.error("Response Error: " + response.statusCode);
			console.error(response);
		}
	});

}

function displayThisMovie(movieName, movieObj) {
	console.log('movie-this,"' + movieName + '"');
	console.log('----------------------------------');
	console.log('Title: ' + movieObj.Title);
	console.log('Year: ' + movieObj.Year);
	console.log('IMDB Rating: ' + movieObj.imdbRating);
	console.log('Country: ' + movieObj.Country);
	console.log('Language: ' + movieObj.Language);
	console.log('Plot: ' + movieObj.Plot);
	console.log('Actors: ' + movieObj.Actors);
	console.log('Rotten Tomatoes Rating: ' + movieObj.tomatoRating);
	console.log('Rotten Tomatoes URL: ' + movieObj.tomatoURL);
	console.log('==================================');
}