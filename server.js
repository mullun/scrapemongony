/* Scraping program using cheerio - NY Times - Front End
 * =============================================== */

// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
// mongoose.connect("mongodb://heroku_ld3wsc3m:i1ec498p6v14eei805tsb9e09@ds159050.mlab.com:59050/heroku_ld3wsc3m");
mongoose.connect("mongodb://localhost/mongonyscrapedb");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Routes
// ======

// Simple index route
app.get("/", function(req, res) {
  res.send(index.html);
});

// This will get the articles we scraped from the mongoDB
app.get("/articles", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

// Delete One from the DB
app.get("/delete/:id", function(req, res) {
  // Remove a note using the objectID
  console.log("entered delete id");
  console.log("req.body.id = ", req.params.id);
  // Article.remove({'_id':req.params.id})
  //   .populate('note',"-_id")
  //   .exec(function(error,removed){
       // userdata contains related without the _id field
    // });
  Article.remove({ _id: req.params.id}, function(error, removed) {
    // Log any errors from mongojs
    if (error) {
      console.log("error =", error);
      res.send(error);
    }
    // Otherwise, send the mongojs response to the browser
    // This will fire off the success function of the ajax request
    else {
      console.log("removed");
      res.send(removed);
    }
  });
});

// Delete all from the DB
app.get("/deleteall", function(req, res) {
  // Remove a note using the objectID
  console.log("entered delete all");
  // Article.remove({'_id':req.params.id})
  //   .populate('note',"-_id")
  //   .exec(function(error,removed){
       // userdata contains related without the _id field
    // });
  Article.remove({}, function(error, removed) {
    // Log any errors from mongojs
    if (error) {
      console.log("error =", error);
      res.send(error);
    }
    // Otherwise, send the mongojs response to the browser
    // This will fire off the success function of the ajax request
    else {
      console.log("removed all");
      res.send(removed);
    }
  });
});

// Add Note to an article in the DB
app.get("/viewnote/:id", function(req, res) {
  console.log("entered view note id");
  console.log("req.params.id = ", req.params.id);
  // use the article id to find the note
  Article.find({ _id: req.params.id})
  .populate("notes")
  .exec(function(error, found) {
    // Log any errors from mongojs
    if (error) {
      console.log("error updating =", error);
      res.send(error);
    }
    // Otherwise, send the mongojs response to the browser
    // This will fire off the success function of the ajax request
    else {
      console.log("found note");
      res.json(found);
    }
  });     
});


// Add Note to an article in the DB
app.post("/addnote/:id", function(req, res) {
	console.log("entered add note id");
	console.log("req.params.id = ", req.params.id);
	
	// Create a new note and pass the req.body to the entry
	var newNote = new Note(req.body);

	newNote.save(function(error, data){
		if (error) {
			console.log("error writing new note");
		} else {
		  // use the article id to find and update the note
		  	Article.findOneAndUpdate({ _id: req.params.id}, {$push: {"notes":data._id} }, {new:true }, function(error, updated) {
			    // Log any errors from mongojs
			  	if (error) {
			      console.log("error updating =", error);
			      res.send(error);
			    }
			    // Otherwise, send the mongojs response to the browser
			    // This will fire off the success function of the ajax request
			    else {
			      console.log("updated");
			      res.send(updated);
				}
			});	    
		}
  	});
});

// A GET request to scrape the echojs website
app.get("/scrape", function(req, res) {
  Article.remove({}, function(error, response){
  	if (error) {
  		console.log("error deleting all articles");
  		return;
  	} 
  	else {
  	  console.log("deleted all articles");
	  // First, we grab the body of the html with request
	  request("https://www.nytimes.com/", function(error, response, html) {
	    // Then, we load that into cheerio and save it to $ for a shorthand selector
	    var $ = cheerio.load(html);
	    // Now, we grab every h2 within an article tag, and do the following:
	    $("h2.story-heading").each(function(i, element) {

	      // Save an empty result object
	      var result = {};

	      // Add the text and href of every link, and save them as properties of the result object
	      result.title = $(this).children("a").text();
	      result.link = $(this).children("a").attr("href");

	      // Using our Article model, create a new entry
	      // This effectively passes the result object to the entry (and the title and link)
	      var entry = new Article(result);

	      // Now, save that entry to the db
	      entry.save(function(err, doc) {
	        // Log any errors
	        if (err) {
	          console.log("error storing scraped to db");
	        }
	        // Or log the doc
	        else {
	          console.log("stored");
	        }
	      });
	    });
	  });
  	}
  });
});




// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});