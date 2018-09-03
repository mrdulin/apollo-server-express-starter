const ADD: string = `
  mutation addBook($book: BookCreateInput!) {
    add (book: $book){
      id
      title
      author
    }
  }
`;

const UPDATE: string = `
  mutation updateBook($book: BookUpdateInput!) {
    update(book: $book) {
      id
      title
      author
    }
  }
`;

export { ADD, UPDATE };
