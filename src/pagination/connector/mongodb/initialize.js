const { Book } = require('../../models/Book');
const { generateBookDatas } = require('../../utils');
const mongoose = require('mongoose');

const { mongooseConnect } = require('./');

mongooseConnect().then(() => {
  const books = generateBookDatas(20, mongoose.Types.ObjectId);
  Book.insertMany(books)
    .then(() => console.log('Initialize book datas successfully'))
    .catch(err => console.log(err));

  process.exit(0);
});
