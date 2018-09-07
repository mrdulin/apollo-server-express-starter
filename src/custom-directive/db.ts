import casual from 'casual';
import shortid from 'shortid';

interface IBook {
  id: string;
  title: string;
  author: string;
  status: string;
}

interface IDb {
  books: IBook[];
}

const db: IDb = {
  books: [
    { id: shortid.generate(), title: casual.title, author: casual.name, status: 'NO_STOCK' },
    { id: shortid.generate(), title: casual.title, author: casual.name, status: 'SOLD_OUT' },
    { id: shortid.generate(), title: casual.title, author: casual.name, status: 'OUT_OF_DATE' }
  ]
};

export { db, IBook };
