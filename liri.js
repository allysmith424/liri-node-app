require("dotenv").config();
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var request = require("request");
var keys = require("./keys.js");
var fs	= require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var commandLine;
var commandAPI;
var commandArgs = "";


function parseCommandLine() {

	commandLine = process.argv;

	commandAPI = process.argv[2];

	for (var i = 3; i < commandLine.length; i++) {

		commandArgs = commandArgs + "+" + commandLine[i];

	}

	commandArgs = commandArgs.substr(1);

};

function twitterSearch() {

	client.get('statuses/user_timeline', function(error, tweets, response) {
	
	if(error) throw error;

	for (var i = 0; i < 20; i++) {

		console.log(tweets[i].created_at);
		console.log(tweets[i].text);

	}

	});

};

function spotifySearch() {

	spotify.search({ type: "track", query: commandArgs }, function(err, data) {
	  if (err) {
	    return console.log("Error occurred: " + err);
	  }

	console.log("\n------------\n");

	console.log(JSON.stringify(data.tracks.items[0].album.artists[0].name, null, 2));

	console.log(JSON.stringify(data.tracks.items[0].name, null, 2));

	console.log(JSON.stringify(data.tracks.items[0].album.external_urls.spotify, null, 2));

	console.log(JSON.stringify(data.tracks.items[0].album.name, null, 2));

	console.log("\n------------\n");

	});

};

function movieSearch() {

	request("http://www.omdbapi.com/?t=" + commandArgs + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

	  if (!error && response.statusCode === 200) {

	    console.log("\n------------\nMovie: " + JSON.parse(body).Title + "\nReleased: " + JSON.parse(body).Year + "\nIMDB Rating: " + JSON.parse(body).imdbRating + "\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + "\nCountry: " + JSON.parse(body).Country + "\nLanguage: " + JSON.parse(body).Language + "\nPlot: " + JSON.parse(body).Plot + "\nActors: " + JSON.parse(body).Actors + "\n------------\n");

  		}

	});

};

function logSearch() {

	fs.appendFile("log.txt", "\n" + commandAPI + " " +  commandArgs, function(error) {

		if (error) {
			
			console.log("Error logging search: " + error);
		
		}

	})

}

// --------------------------------------------
// --------------------------------------------
// --------------------------------------------

parseCommandLine();

logSearch();


if (commandAPI === "my-tweets") {

	twitterSearch();

}

if (commandAPI === "spotify-this-song") {

	spotifySearch();

}

if (commandAPI === "movie-this") {

	movieSearch();

}

else if (commandAPI === "do-what-it-says") {

	fs.readFile("random.txt", "utf8", function(error, result) {

		if (error) {

			console.log(error);

		}

		else {

			spotifySearch();

		}


	})

}









