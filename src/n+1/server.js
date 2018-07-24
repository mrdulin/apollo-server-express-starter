const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const cors = require('cors');
const DataLoader = require('dataloader');

const { init, openDB } = require('./db');

init();

const typeDefs = `
  type Query {
    books: [Book]
  }

  type Author {
    id: ID!
    name: String!
  }

  type Book {
    id: ID!
    title: String!
    author: Author
  }
`;

function getBooks() {
  return new Promise(resolve => {
    openDB(lowdb => {
      resolve(lowdb.get('books').value());
    });
  });
}

function getUserById(id) {
  return new Promise((resolve, reject) => {
    // mock error
    // if (id === 'b') {
    //   reject(new Error('get author b error'));
    //   return;
    // }
    openDB(lowdb => {
      console.log('open db');
      const author = lowdb
        .get('authors')
        .find({ id })
        .value();
      resolve(author);
    });
  });
}

// function getUsersById(ids) {
//   return new Promise(resolve => {
//     const userPromises = [];

//     for (const id of ids) {
//       userPromises.push(getUserById(id));
//     }
//     resolve(userPromises);
//   });
// }

function getUsersById(ids) {
  const promises = [];
  for (const id of ids) {
    promises.push(getUserById(id));
  }

  const users = Promise.all(promises);
  return users;
}

const dataloaders = () => {
  return {
    userById: new DataLoader(ids => getUsersById(ids))
  };
};

const resolvers = {
  Query: {
    books: () => getBooks()
  },
  Book: {
    author: (book, args, context) => {
      console.log('book.author: ', book);

      // 优化前
      // return getUserById(book.authorId);

      // 使用dataloader优化后
      return context.dataloaders.userById.load(book.authorId);
    }
  }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();

app.use(cors());
app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress({
    schema,
    context: {
      dataloaders: dataloaders()
    }
  })
);
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
app.listen(4000, () => {
  console.log('Go to http://localhost:4000/graphiql to run queries!');
});
