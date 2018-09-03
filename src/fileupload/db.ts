import low, { AdapterSync } from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import path from 'path';

const adapter: AdapterSync = new FileSync(path.resolve(__dirname, './lowdb.json'));
const lowdb = low(adapter);

const collections = {
  uploads: 'uploads'
};

lowdb.defaults({ [collections.uploads]: [] }).write();

export { lowdb, collections };
