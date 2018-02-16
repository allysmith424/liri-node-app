require("dotenv").config();
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var request = require("request");
var keys = require("./keys.js");

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

}


if (process.argv[2] === "my-tweets") {

	// var params = {screen_name: 'nodejs'};
	// client.get('statuses/user_timeline', params, function(error, tweets, response) {
	//   if (!error) {
	//     console.log(tweets);
	//   }
	// });

	client.get('search/tweets', {q: 'node.js'}, function(error, tweets, response) {
	   console.log(tweets);
	});

}

if (process.argv[2] === "spotify-this-song") {

	parseCommandLine();
	 
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

}

if (process.argv[2] === "movie-this") {

	parseCommandLine();

	request("http://www.omdbapi.com/?t=" + commandArgs + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

	  if (!error && response.statusCode === 200) {

	    console.log("\n------------\nMovie: " + JSON.parse(body).Title + "\nReleased: " + JSON.parse(body).Year + "\nIMDB Rating: " + JSON.parse(body).imdbRating + "\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + "\nCountry: " + JSON.parse(body).Country + "\nLanguage: " + JSON.parse(body).Language + "\nPlot: " + JSON.parse(body).Plot + "\nActors: " + JSON.parse(body).Actors + "\n------------\n");

  		}

	});

}

else if (process.argv[2] === "do-what-it-says") {

	parseCommandLine();

	fs.readFile("random.txt", "utf8", function(error, result) {

		if (error) {

			console.log(error);

		}

		else {

			var spotify = new Spotify({
			  id: keys.spotify.id,
			  secret: keys.spotify.secret
			});
			 
			spotify.search({ type: "track", query: commandArgs }, function(err, data) {
			  if (err) {
			    return console.log("Error occurred: " + err);
			  }

			console.log("\n ------------\n");

			console.log(JSON.stringify(data.tracks.items[0].album.artists[0].name, null, 2));

			console.log(JSON.stringify(data.tracks.items[0].name, null, 2));

			console.log(JSON.stringify(data.tracks.items[0].album.external_urls.spotify, null, 2));

			console.log(JSON.stringify(data.tracks.items[0].album.name, null, 2));

			console.log("\n ------------\n");

			});
			console.log("\n ------------\n");

				}

	})

}









