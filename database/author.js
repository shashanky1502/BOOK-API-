const mongoose = require("mongoose");

//author SCHEMA
const AuthorSchema = mongoose.Schema({
  id: Number,
  name: String,
  books: [String]
});

//Creating author Model
const AuthorModel = mongoose.model("authors", AuthorSchema);

module.exports = AuthorModel;