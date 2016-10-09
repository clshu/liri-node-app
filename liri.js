
var twKeys = require('./keys');
var Twitter = require('twitter');

var defaultScreenName = 'chinlong';
var defaultSong = 'The Sign';
var defaultMovie = 'Mr. Nobody';

myTweets();

function myTweets() {
	var twClient = new Twitter(twKeys.twitterKeys);
	var twParams = {screen_name: 'chinlong', count: 20};
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