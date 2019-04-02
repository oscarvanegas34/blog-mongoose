var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3500;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/blogNews", { useNewUrlParser: true });

// Routes

// A GET route for scraping the google news website
app.get("/scraper", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://news.google.com/topics/CAAqLAgKIiZDQkFTRmdvSUwyMHZNRFZxYUdjU0JtVnpMVFF4T1JvQ1ZWTW9BQVAB?hl=es-419&gl=US&ceid=US%3Aes-419").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)  
        .children("h4")
        .children("a")
        .text();
      result.link = $(this)  
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      db.News.create(result)
        .then(function(dbNews) {
          // View the added result in the console
          console.log(dbNews);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/news", function(req, res) {
  // Grab every document in the Articles collection
  db.News.find({})
    .then(function(dbNews) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbNews);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/news/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.News.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbNews) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbNews);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/news/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Comments.create(req.body)
    .then(function(dbComments) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.News.findOneAndUpdate({ _id: req.params.id }, { note: dbComments._id }, { new: true });
    })
    .then(function(dbNews) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbNews);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});






















// var cheerio = require("cheerio");
// var axios = require("axios");

// // First, tell the console what server2.js is doing
// console.log("\n******************************************\n" +
//             "Grabbing every article headline and link\n" +
//             "from the Google news website:" +
//             "\n******************************************\n");

// // Making a request via axios for `google.news`'s homepage
// axios.get("https://news.google.com/topics/CAAqLAgKIiZDQkFTRmdvSUwyMHZNRFZxYUdjU0JtVnpMVFF4T1JvQ1ZWTW9BQVAB?hl=es-419&gl=US&ceid=US%3Aes-419").then(function(response) {

//   // Load the body of the HTML into cheerio
//   var $ = cheerio.load(response.data);

//   // Empty array to save our scraped data
//   var results = [];

//   // With cheerio, find each h4-tag with the class "headline" and loop through the results
//   $("article").each(function(i, element) {

//     // Save the text of the h4-tag as "title"
//     // var title = $(element).text();
//     var title = $(element).find("h4").children("a").text();
//     // Find the h4 tag's children a-tag, and save it's href value as "link"
//     var link = $(element).children().attr("href");

//     // Make an object with data we scraped for this h4 and push it to the results array
//     results.push({
//       title: title,
//       link: link
//     });
//   });

//   // After looping through each h4.ipQwMb.ekueJc.RD0gLb, log the results
//   console.log(results);
// });
