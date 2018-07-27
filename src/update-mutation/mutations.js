exports.ADD = `
  mutation addBook($book: BookCreateInput!) {
    add (book: $book){
      id
      title
      author
    }
  }
`;

exports.UPDATE = `
  mutation updateBook($book: BookUpdateInput!) {
    update(book: $book) {
      id
      title
      author
    }
  }
`;
