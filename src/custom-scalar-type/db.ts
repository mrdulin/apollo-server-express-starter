import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import path from 'path';
import shortid from 'shortid';

const adapter = new FileSync(path.resolve(__dirname, './lowdb.json'));
const lowdb = low(adapter);

lowdb.defaults({ books: [] }).write();

lowdb
  .set('books', [
    {
      id: shortid.generate(),
      title: "Harry Potter and the Sorcerer's stone",
      author: 'J.K. Rowling',
      updatedAt: new Date('2018/9/1')
    },
    {
      id: shortid.generate(),
      title: 'Jurassic Park',
      author: 'Michael Crichton',
      updatedAt: new Date('2018/8/1')
    }
  ])
  .write();

export { lowdb };
