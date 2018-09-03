function generateGraphQLTypes(typeName: string, schema: { [key: string]: string }): string {
  const typeDefsFragment = (required = ''): string =>
    Object.keys(schema)
      .map((name: string) => `\n  ${name}: ${schema[name]}${required}`)
      .join(',');

  const types: string = `
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

const typesString: string = generateGraphQLTypes('Book', {
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

export { typeDefs };
