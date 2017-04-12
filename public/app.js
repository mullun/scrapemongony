// Grab the articles as a json and put them in the articles DIV
$.getJSON("/articles", function(data) {
  console.log("entered getJSON function");
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "</span><span class=deleter>X</span><span class=note-adder>Add Note</span><span class=note-viewer>View Note</span></p>");
  }
});


// When user clicks the deleter button for a note
$(document).on("click", ".deleter", function() {
  // Save the p tag that encloses the button
  var selected = $(this).parent();
  // Make an AJAX GET request to delete the specific note
  // this uses the data-id of the p-tag, which is linked to the specific note
  $.ajax({
    type: "GET",
    url: "/delete/" + selected.attr("data-id"),

    // On successful call
    success: function(response) {
      // Remove the p-tag from the DOM
      selected.remove();
      // Make sure the #actionbutton is submit (in case it's update)
      $("#actionbutton").html("<button id='scrape'>Scrape</button>");
    }
  });
});


// When user clicks the deleter button for a note
$(document).on("click", "#clearall", function() {
  // Make an AJAX GET request to delete all articles
  // this uses the data-id of the p-tag, which is linked to the specific note
  $.ajax({
    type: "GET",
    url: "/deleteall",

    // On successful call
    success: function(response) {
      // Remove the articles from screen
      $("#articles").empty();
      // Make sure the #actionbutton is submit (in case it's update)
      $("#actionbutton").html("<button id='scrape'>Scrape</button>");
    }
  });
});

// When user clicks the note-adder button for a note
$(document).on("click", ".note-adder", function() {
  console.log("entered click for note-adder");
  // Save the p tag that encloses the button
  var selected = $(this).parent();
  console.log("selected = " + selected);
  // Make an AJAX GET request to delete the specific note
  // this uses the data-id of the p-tag, which is linked to the specific note

  $.ajax({
    type: "POST",
    url: "/addnote/" + selected.attr("data-id"),
    dataType: "json",
    data: {
      title: $("#note").val(),
      body:$("#note").val()
    },
    // On successful call
    success: function(response) {
      // Clear the inputs
      $("#note").val("");
      console.log("note section cleared");
      // Make sure the #actionbutton is submit (in case it's update)
      $("#actionbutton").html("<button id='scrape'>Scrape</button>");
    }
  });
});


// When user clicks the note-viewer button for a note
$(document).on("click", ".note-viewer", function() {
  console.log("entered click for note-viewer");
  // Save the p tag that encloses the button
  var selected = $(this).parent();
  console.log("selected in note viewer = " + selected);
  // Make an AJAX GET request to delete the specific note
  // this uses the data-id of the p-tag, which is linked to the specific note

  $.ajax({
    type:"GET",
    url:"/viewnote/" + selected.attr("data-id"), 
    success: function(response) {
      // Fill the text boxes with the received data
      console.log("view note response = ");
      console.log(response[0].notes);
      // clear what is there
      $("#note").empty();
      for (var i = 0; i < response[0].notes.length; i++) {
        $("#note").append(response[0].notes[i].title);
        $("#note").append("\n");
        console.log("inside for loop");
      }
      // Make sure the #actionbutton is submit (in case it's update)
      $("#actionbutton").html("<button id='scrape'>Scrape</button>");
    }
  });


  // $.ajax({
  //   type: "GET",
  //   url: "/viewnote/" + selected.attr("data-id"),
  //   // On successful call
  //   success: function(response) {
  //     // Fill the text boxes with the received data
  //     console.log("view note response = ");
  //     console.log(response[0].notes);
  //     // clear what is there
  //     $("#note").val("");
  //     for (var i = 0; i < response[0].notes.length; i++) {
  //       $("#note").append(response[0].notes[i].title);
  //       $("#note").append("\n");
  //     }
  //     // Make sure the #actionbutton is submit (in case it's update)
  //     $("#actionbutton").html("<button id='scrape'>Scrape</button>");
  //   }
  // });
});


// When user clicks the scrape button for a note
$(document).on("click", "#scrape", function() {
  console.log("entered click for scraping");
  // Make an AJAX GET request to scrape
  $.ajax({
    type: "GET",
    url: "/scrape",
    // On successful call
    success: function(response) {
      console.log("scraped things");
      // Clear the inputs
      $("#note").val("");
      // Make sure the #actionbutton is submit (in case it's update)
      $("#actionbutton").html("<button id='scrape'>Scrape</button>");
    }
  });
});
// // Loads database contents onto the page
// function getArticles() {
//   // Empty any results currently on the page
//   $("#articles").empty();
//   // Grab all of the current articles
//   $.getJSON("/articles", function(data) {
//     console.log("entering loop");
//     console.log("retrieved data = ", data);
//     console.log("number of articles = " + data.length);
//     // For each article...
//     for (var i = 0; i < data.length; i++) {
//       // ...populate #results with a p-tag that includes the article's title and object id
//       $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "</span><span class=deleter>X</span><span class=note-adder>Add Note</span><br />" + data[i].link + "</p>");
//       // $("#articles").append("<p" + data[i].link + "</p>");
//       // $("#articles").append("<p class='dataentry' data-id=" + data[i]._id + "><span class='dataTitle' data-id=" +
//       //   data[i]._id + ">" + data[i].title + "</span><span class=deleter>X</span><span class=note-adder>Add Note</span></p>");
//     }
//   });
// }

// Runs the getArticles function as soon as the script is executed
// getArticles();
