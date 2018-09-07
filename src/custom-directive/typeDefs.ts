const typeDefs: string = `
  directive @uppercase on FIELD_DEFINITION

  # 声明指令@upper，但是没有在makeExecutableSchema.schemaDirectives注册该名称的指令，因此无效
  directive @upper on FIELD_DEFINITION

  directive @auth(
    requires: Role = ADMIN,
  ) on OBJECT | FIELD_DEFINITION

  enum Status {
    SOLD_OUT
    NO_STOCK
    OUT_OF_DATE @deprecated(reason: "This value is deprecated")
  }

  type Book {
    id: ID!
    title: String @uppercase
    author: String @upper
    status: Status
    name: String @deprecated(reason: "Use title instead")
  }

  enum Role {
    ADMIN
    REVIEWER
    USER
    UNKNOWN
  }

  type User @auth(requires: USER) {
    id: ID!
    name: String
    banned: Boolean @auth(requires: ADMIN)
    canPost: Boolean @auth(requires: REVIEWER)
  }

  type Query {
    books: [Book]!
    bookByStatus(status: Status!): [Book]!
    user(id: ID!): User
  }
`;

export { typeDefs };
