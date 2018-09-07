import shortid from 'shortid';
import casual from 'casual';

const db = {
  books: [
    { id: shortid.generate(), title: casual.title, author: casual.name },
    { id: shortid.generate(), title: casual.title, author: casual.name }
  ]
};

export { db };
