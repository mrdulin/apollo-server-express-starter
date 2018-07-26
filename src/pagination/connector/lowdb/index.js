const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const shortid = require('shortid');

const { generateBookDatas } = require('../../utils');

const adapter = new FileSync(path.resolve(__dirname, './lowdb.json'));
const lowdb = low(adapter);

lowdb.defaults({ books: [] }).write();

lowdb.set('books', generateBookDatas(20, shortid.generate)).write();

exports.lowdb = lowdb;
