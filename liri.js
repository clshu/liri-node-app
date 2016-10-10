
var twKeys = require('./keys');
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');

var defaultScreenName = 'chinlong';
var defaultSong = 'The Sign';
var defaultMovie = 'Mr. Nobody';
var defaultInputFile = './random.txt'
var defaultLogFile = './log.txt'


var param1, param2;
var params = [];
var isLogging = process.env.LIRI_LOGGING;
//console.log('LIRI_LOGGING: ' + isLogging);
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
	console.log("node liri.js [Commands] <option>")
	console.log("e.x.:")
	console.log("node liri.js my-tweets");
	console.log("node liri.js spotify-this-song <song>");
	console.log("node liri.js movie-this <movie>");
	console.log("node liri.js do-what-it-says\n");
	console.log("LIRI_LOGGING=true node liri.js [Commands] <option> will turn on logging to log.txt")
	console.log("Default is false. i.e. No logging.")
}

function myTweets() {
	var twClient = new Twitter(twKeys.twitterKeys);
	var twParams = {screen_name: defaultScreenName, count: 20};
	twClient.get('statuses/user_timeline', twParams, function(error, tweets, response) {
  		if (error) {
    		return console.error(error);
  		}

  		displayMyTweets(tweets, isLogging);
	});
};
function displayMyTweets(tweets, logging) {
	var str = "";
	str += 'Command: my-tweets\n';
  	tweets.forEach(function(tweet) {
  		str += '----------------------------------\n';
  		str += tweet.created_at + ':\n';
  		str += '  ' + tweet.text + '\n';
  	});
  	str += '==================================\n';
  	console.log(str);
  	if (logging) {
  		loggingOutput(defaultLogFile, str);
  	}
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
    	var thisSong = data.tracks.items.filter(function(item) {
    		return item.name.toLowerCase() === song.toLowerCase();
    	});
 
    	if (thisSong.length > 0) {
    		displayThisSongWrapper(song, thisSong, isLogging);
    	} else {
    		console.log('Invalid return data: No song found');
    	};
	});

}

function displayThisSongWrapper(song, thisSong, logging) {
	var str = "";

    str += 'Command: spotify-this-song,"' + song + '"\n';
    thisSong.forEach(function(songObj) {
    	str += displayThisSong(songObj);
    });
  	str += '==================================\n';
  	console.log(str);

  	if (logging) {
  		loggingOutput(defaultLogFile, str);
  	}
}

function displayThisSong(obj) {
	var str = "";
	// Extract artist's name(s)
	// There could be more than one artist
	var artists = obj.artists.map(function(artist) {
		return artist.name;
	});

	str += '----------------------------------\n';
	str += 'Artist(s): ' + artists.join(', ') + '\n';
	str += 'Name: ' + obj.name + '\n';
	str += 'Preview: ' + obj.preview_url + '\n';
	str += 'Album: ' + obj.album.name + '\n';

	return str;
}

function movieThis(movieName) {
	var url = 'http://www.omdbapi.com/?t=' + movieName + '&tomatoes=true&y=&plot=short&r=json';

	request(url, function (error, response, body) {

		if (error) {
			return console.error(error);
		}

		if (response.statusCode == 200) {
			displayThisMovie(movieName, JSON.parse(body), isLogging);
		} else {
			console.error("Response Error: " + response.statusCode);
			console.error(response);
		}
	});

}

function displayThisMovie(movieName, movieObj, logging) {
	var str = "";
	str += 'Command: movie-this,"' + movieName + '"\n';
	str += '----------------------------------\n';
	str += 'Title: ' + movieObj.Title + '\n';
	str += 'Year: ' + movieObj.Year + '\n';
	str += 'IMDB Rating: ' + movieObj.imdbRating + '\n';
	str += 'Country: ' + movieObj.Country + '\n';
	str += 'Language: ' + movieObj.Language + '\n';
	str += 'Plot: ' + movieObj.Plot + '\n';
	str += 'Actors: ' + movieObj.Actors + '\n';
	str += 'Rotten Tomatoes Rating: ' + movieObj.tomatoRating + '\n';
	str += 'Rotten Tomatoes URL: ' + movieObj.tomatoURL + '\n';
	str += '==================================\n';

	console.log(str);

	if (logging) {
		loggingOutput(defaultLogFile, str);
	}
}

function doWhatItSays() {
	var param1 = null;
	var param2 = null;

	fs.readFile(defaultInputFile, { encoding: 'utf8' }, function(error, data) {
		if (error) {
			return console.error(error);
		}
	
		var dataArr = data.split(',');

		if (dataArr[0]) {
			param1 = dataArr[0].toLowerCase();
			if (param1 == 'do-what-it-says') {
				// prevent recursive calls.
				console.log("Can't use do-what-it-says in " + defaultInputFile);
				return;
			}
		} else {
			return; // bad formatted line
		}
		if (dataArr[1]) {
			param2 = dataArr[1].slice(1, -1); // remove "" 
		}

		chooseAction(param1, param2);
	});
}

function loggingOutput(fname, data) {
	fs.appendFile(fname, data, function(err) {
		if (err) {
			return console.error(err);
		}
	});
}