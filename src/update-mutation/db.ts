import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { AdapterSync } from 'lowdb';
import path from 'path';

const adapter: AdapterSync = new FileSync(path.resolve(__dirname, './lowdb.json'));
const lowdb = low(adapter);

lowdb.defaults({ books: [] }).write();

interface IBook {
  id: string;
  title: string;
  author: string;
}

const books: IBook[] = [
  {
    id: '1',
    title: "Harry Potter and the Sorcerer's stone",
    author: 'J.K. Rowling'
  },
  {
    id: '2',
    title: 'Jurassic Park',
    author: 'Michael Crichton'
  }
];

lowdb.set('books', books).write();

export { lowdb, IBook };
