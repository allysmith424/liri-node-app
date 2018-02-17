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

var doWhatItSaysOptions = ["spotify-this-song,I Want it That Way", "movie-this,Pulp Fiction", "spotify-this-song,Bamboleo", "movie-this,Memento"];

var randomChoice;


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

		console.log("\n" + tweets[i].created_at);
		console.log(tweets[i].text);

	}

	});

};

function spotifySearch(commandArgs) {

	spotify.search({ type: "track", query: commandArgs }, function(err, data) {
	  
	  if (err) {

	    console.log("Error occurred: " + err);

	  }

		console.log("\n------------\n");

		console.log(JSON.stringify(data.tracks.items[0].album.artists[0].name, null, 2));

		console.log(JSON.stringify(data.tracks.items[0].name, null, 2));

		console.log(JSON.stringify(data.tracks.items[0].album.external_urls.spotify, null, 2));

		console.log(JSON.stringify(data.tracks.items[0].album.name, null, 2));

		console.log("\n------------\n");

	});

};

function movieSearch(commandArgs) {

	request("http://www.omdbapi.com/?t=" + commandArgs + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

	  if (!error && response.statusCode === 200) {

	  	if (JSON.parse(body).Title === undefined) {

	  		console.log("\n\nI can't find that one I'm afraid, please try a different movie.\n\n")

	  	}

	  	else if (JSON.parse(body).Ratings[1] === undefined && JSON.parse(body).Title !== undefined) {

		    console.log("\n------------\nMovie: " + JSON.parse(body).Title + "\nReleased: " + JSON.parse(body).Year + "\nIMDB Rating: " + JSON.parse(body).imdbRating + "\nRotten Tomatoes Rating: Unavailable... I'm afraid :/\nCountry: " + JSON.parse(body).Country + "\nLanguage: " + JSON.parse(body).Language + "\nPlot: " + JSON.parse(body).Plot + "\nActors: " + JSON.parse(body).Actors + "\n------------\n");

		}

		else  {

			console.log("\n------------\nMovie: " + JSON.parse(body).Title + "\nReleased: " + JSON.parse(body).Year + "\nIMDB Rating: " + JSON.parse(body).imdbRating + "\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + "\nCountry: " + JSON.parse(body).Country + "\nLanguage: " + JSON.parse(body).Language + "\nPlot: " + JSON.parse(body).Plot + "\nActors: " + JSON.parse(body).Actors + "\n------------\n");

		}

  		}

	});

};

function logSearch() {

	fs.appendFile("log.txt", "\n" + commandAPI + " " +  commandArgs, function(error) {

		if (error) {
			
			console.log("Error logging search: " + error);
		
		}

	});

}

function generateRandomChoice() {

	randomChoice = doWhatItSaysOptions[Math.floor(Math.random() * 4)];

	fs.writeFile("random.txt", randomChoice, function(error) {

		if (error) {

			console.log("Uh oh... I had trouble writing to the file.\n\n Here are the details: \n" + error);
	
		}

	});

};

function readFile() {

	fs.readFile("random.txt", "utf8", function(error, result) {

		if (error) {

			console.log("Uh oh... I had trouble reading the file.\n\n Here are the details: \n" + error);

		}

		else {

			dwisAPI = result.substr(0, result.indexOf(","));
			dwisSearchTerm = result.substr(result.indexOf(","));

			dwisSearchTerm = dwisSearchTerm.substr(1);

			if (dwisAPI === "spotify-this-song") {

				spotifySearch(dwisSearchTerm);

			}

			else if (dwisAPI === "movie-this") {

				movieSearch(dwisSearchTerm);

			}

		}

	})

}

// --------------------------------------------
// LET LIRI COME TO LIFE!
// --------------------------------------------

generateRandomChoice();

parseCommandLine();

logSearch();


if (commandAPI === "my-tweets") {

	twitterSearch();

}

else if (commandAPI === "spotify-this-song") {

	spotifySearch(commandArgs);

}

else if (commandAPI === "movie-this") {

	movieSearch(commandArgs);

}

// I'm not sure I quite understood the goal of this command... this might be an odd perversion of what was intended!

else if (commandAPI === "do-what-it-says") {

	readFile();

}

else {

	console.log("\nPlease ask me to\n\n - find a song with spotify-this-song followed by a song\n - find a movie with movie-this followed by a movie\n - show you my latest tweets with my-tweets\n - do what I like with do-what-it-says\n\n");

}