const mongoose = require("mongoose");

//BOOK SCHEMA
const BookSchema = mongoose.Schema({
  ISBN: String,
  title: String,
  pubDate: String,
  language: String,
  numPage: Number,
  author: [Number],
  publications:Number,
  category: [String]
});

//Creating Book Model
const BookModel = mongoose.model("book", BookSchema);

module.exports = BookModel;