// On click function to scrape

$("#scrape").click(function() {
 
  $.getJSON("/scraper", function() {
console.log("its working");
  });
  // Grab the news as a json
  $.getJSON("/news", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      // https://news.google.com/articles/CAIiEP9n2hT1uzesmjuaECUMJZ4qGQgEKhAIACoHCAow6br7CjDjmPQCMPO60gU?hl=es-419&gl=US&ceid=US%3Aes-419
      // $("#news").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
      const link = data[i].link.slice(1, data[i].link.length)
      $("#news").append(`
        <tr>
          <th scope="row">${i}</th>
          <td data-id="${data[i]._id}"><a href="https://news.google.com${link}">${data[i].title}</a></td>
          <td data-id="${data[i]._id}"><button class="btn btn-outline-success articleBtn" data-id="${data[i]._id}" type="button">Save Articles</button></td>          
        </tr>`);

      // <tr data-id="${data[i]._id}"><a href="https://news.google.com${link}">${data[i].title}</a></td>
  
    }
  });

});

// // Saving Articles
// $(document).on("click", ".articleBtn", function() {
   
//   var id = $(this).attr( "data-id" )
//   console.log(id);

//   // Grab the news as a json
//   $.getJSON(`/news/${id}`, function(data) {
//     // For each one
//     for (var i = 0; i < data.length; i++) {
//       // Display the apropos information on the page
//       // https://news.google.com/articles/CAIiEP9n2hT1uzesmjuaECUMJZ4qGQgEKhAIACoHCAow6br7CjDjmPQCMPO60gU?hl=es-419&gl=US&ceid=US%3Aes-419
//       // $("#news").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
//       const link = data[i].link.slice(1, data[i].link.length)
//       $("#myArticles").append(`
//         <tr>
//           <th scope="row">${i}</th>
//           <td data-id="${data[i]._id}"><a href="https://news.google.com${link}">${data[i].title}</a></td>
//           <td data-id="${data[i]._id}"><button class="btn btn-outline-success" id="articlesNotes" type="button">Articles Notes</button></td> 
//           <td data-id="${data[i]._id}"><button class="btn btn-outline-success" id="deleteFromSave" type="button">Delete From Saved</button></td>          
//         </tr>`);

//       // <tr data-id="${data[i]._id}"><a href="https://news.google.com${link}">${data[i].title}</a></td>
  
//     }
//   });
// });

















// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the comments from the comment section
  $("#comments").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the News
  $.ajax({
    method: "GET",
    url: "/news" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the news
      $("#comments").append("<h2>" + data.title + "</h2>");
      // An input to enter a new name
      $("#comments").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#comments").append("<button data-id='" + data._id + "' id='savecomment'>Save Comment</button>");

      // If there's a note in the article
      if (data.comments) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.comments.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.comments.body);
      }
    });
});






// When you click the savecomment button
$(document).on("click", "#savecomment", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the comments, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/news/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the comments section
      $("#comments").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
