import casual from 'casual';
import shortid from 'shortid';

interface IBook {
  id: string;
  title: string;
  author: string;
}

const authorId1: string = shortid.generate();
const authorId2: string = shortid.generate();

const db = {
  books: [
    { id: shortid.generate(), title: casual.title, authorId: authorId1 },
    { id: shortid.generate(), title: casual.title, authorId: authorId2 }
  ],
  users: [{ id: authorId1, name: casual.name }, { id: authorId2, name: casual.name }]
};

export { IBook, db };
