function generateGraphQLTypes(typeName, schema) {
  const typeDefsFragment = (required = '') =>
    Object.keys(schema)
      .map(name => `\n  ${name}: ${schema[name]}${required}`)
      .join(',');

  const types = `
    input ${typeName}CreateInput {
      ${typeDefsFragment('!')}
    }

    input ${typeName}UpdateInput {
      id: ID!
      ${typeDefsFragment()}
    }

    type ${typeName} {
      id: ID!
      ${typeDefsFragment()}
    }
  `;
  return types;
}

const typesString = generateGraphQLTypes('Book', {
  title: 'String',
  author: 'String'
});

const typeDefs = `
  ${typesString}

  type Query {
    books: [Book!]!
  }

  type Mutation{
    add(book: BookCreateInput!): Book
    update(book: BookUpdateInput!): Book
  }
`;

exports.typeDefs = typeDefs;
