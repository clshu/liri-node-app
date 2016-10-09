
var twKeys = require('./keys');
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');

var defaultScreenName = 'chinlong';
var defaultSong = 'The Sign';
var defaultMovie = 'Mr. Nobody';
var defaultInputFile = './random.txt'

var param1, param2;
var params = [];

// Eexcution
//
// Handling prompts
if (process.argv[2]) {
	param1 = process.argv[2].toLowerCase();
} else {
	displayErr();
	return;
}

if (process.argv[3]) {
	for (var i = 3; i < process.argv.length; i++) {
		params.push(process.argv[i]);
	}
	param2 = params.join(' ');
} else {
	param2 = null;
}

chooseAction(param1, param2);

return;

// Functions

function chooseAction(param1, param2) {
	switch(param1) {
		case 'my-tweets':
			myTweets();
			return;
		case 'spotify-this-song':
			var song = param2 || defaultSong;
			spotifyThisSong(song);
			return;
		case 'movie-this':
			var movie = param2 || defaultMovie;
			movieThis(movie);
			return;
		case 'do-what-it-says':
			doWhatItSays();
			return;
		default:
			displayErr();
			return;
	}
}

function displayErr() {
	console.log("Invalid Parameters.");
	console.log("Usage:");
	console.log("node liri.js my-tweets");
	console.log("node liri.js spotify-this-song <song>");
	console.log("node liri.js movie-this <movie>");
	console.log("node liri.js do-what-it-says");
}

function myTweets() {
	var twClient = new Twitter(twKeys.twitterKeys);
	var twParams = {screen_name: defaultScreenName, count: 20};
	twClient.get('statuses/user_timeline', twParams, function(error, tweets, response) {
  		if (error) {
    		return console.error(error);
  		}

  		displayMyTweets(tweets);
	});
};
function displayMyTweets(tweets) {
	console.log('my-tweets');
  	tweets.forEach(function(tweet) {
  		console.log('----------------------------------');
  		console.log(tweet.created_at + ':');
  		console.log('  ' + tweet.text);
  	});
  	console.log('==================================');
}
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
    		displayThisSongWrapper(song, thisSong);
    	} else {
    		console.log('Invalid return data: No song found');
    	};
	});

}

function displayThisSongWrapper(song, thisSong) {
    console.log('spotify-this-song,"' + song + '"');
    thisSong.forEach(function(songObj) {
    	displayThisSong(songObj);
    });
  	console.log('==================================');
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

function doWhatItSays() {
	var param2 = null;

	fs.readFile(defaultInputFile, { encoding: 'utf8' }, function(error, data) {
		if (error) {
			return console.error(error);
		}
	
		var dataArr = data.split(',');
		if (dataArr[1]) {
			param2 = dataArr[1].slice(1, -1); // remove "" 
		}

		chooseAction(dataArr[0], param2);
	});
}