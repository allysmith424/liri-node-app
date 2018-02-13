require("dotenv").config();
require("node-spotify-api");
require("twitter");

var keys = ("./keys.js")

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

