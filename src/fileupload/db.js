const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const adapter = new FileSync(path.resolve(__dirname, './lowdb.json'));
const lowdb = low(adapter);

lowdb.defaults({ uploads: [] }).write();

exports.lowdb = lowdb;
