import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import path from 'path';
import shortid from 'shortid';
import casual from 'casual';

const adapter = new FileSync(path.resolve(__dirname, './lowdb.json'));
const lowdb = low(adapter);

lowdb.defaults({ posts: [], authors: [] }).write();

interface IPost {
  id: string;
  title: string;
  content: string;
  views: number;
}

interface IAuthor {
  id: string;
  firstName: string;
  lastName: string;
}

interface IAuthorModel extends IAuthor {
  postIds: string[];
}

const postId1 = shortid.generate();
const postId2 = shortid.generate();

const posts: IPost[] = [
  { id: postId1, title: casual.title, content: casual.sentences(3), views: casual.integer(0, 10000) },
  { id: postId2, title: casual.title, content: casual.sentences(3), views: casual.integer(0, 10000) }
];

const authors: IAuthorModel[] = [
  { id: casual.uuid, firstName: casual.first_name, lastName: casual.last_name, postIds: [postId1, postId2] }
];

lowdb.set('posts', posts).write();
lowdb.set('authors', authors).write();

export { lowdb, IPost, IAuthor, IAuthorModel };
