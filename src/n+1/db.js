const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const adapter = new FileSync(path.resolve(__dirname, './lowdb.json'));
const lowdb = low(adapter);

lowdb.defaults({ books: [], authors: [] }).write();

const books = [
  {
    id: '1',
    title: "Harry Potter and the Sorcerer's stone",
    authorId: 'a'
  },
  {
    id: '2',
    title: 'Jurassic Park',
    authorId: 'b'
  },
  {
    id: '3',
    title: 'angular',
    authorId: 'a'
  },
  {
    id: '4',
    title: 'react',
    authorId: 'b'
  }
];

const authors = [
  {
    id: 'a',
    name: 'mrdulin'
  },
  {
    id: 'b',
    name: 'novaline'
  }
];

function init() {
  lowdb.set('books', books).write();
  lowdb.set('authors', authors).write();
  console.log('database initialize successfully');
}

function openDB(cb) {
  setTimeout(() => cb(lowdb), 200);
}

exports.openDB = openDB;
exports.lowdb = lowdb;
exports.init = init;
