const mongoose = require('mongoose');

const { Schema } = mongoose;

const bookSchema = new Schema({
  title: String,
  author: String
});

exports.Book = mongoose.model('Book', bookSchema);
