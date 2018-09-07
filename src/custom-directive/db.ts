import casual from 'casual';
import shortid from 'shortid';

interface IBook {
  id: string;
  title: string;
  author: string;
  status: string;
}

interface IUser {
  id: string;
  name: string;
  banned: boolean;
  canPost: boolean;
  roles: string[];
}

interface IDb {
  books: IBook[];
  users: IUser[];
}

const db: IDb = {
  books: [
    { id: shortid.generate(), title: casual.title, author: casual.name, status: 'NO_STOCK' },
    { id: shortid.generate(), title: casual.title, author: casual.name, status: 'SOLD_OUT' },
    { id: shortid.generate(), title: casual.title, author: casual.name, status: 'OUT_OF_DATE' }
  ],
  users: [
    {
      id: '1',
      name: casual.name,
      banned: casual.boolean,
      canPost: casual.boolean,
      roles: ['ADMIN', 'USER']
    }
  ]
};

export { db, IBook };
