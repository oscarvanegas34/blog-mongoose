var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new CommentsSchema object
// This is similar to a Sequelize model
var CommentsSchema = new Schema({
  // `title` is of type String
  name: String,
  // `body` is of type String
  body: String
});

// This creates our model from the above schema, using mongoose's model method
var Comments = mongoose.model("Comments", CommentsSchema);

// Export the Note model
module.exports = Comments;
