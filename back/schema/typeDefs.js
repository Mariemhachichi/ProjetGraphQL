const gql = String.raw;

const typeDefs = gql`
  type Author {
    id: ID!
    name: String!
    books: [Book!]!
  }

  type Book {
    id: ID!
    title: String!
    genre: String!
    author: Author!
  }

  type User {
  id: ID!
  username: String!
  token: String
}

  type Query {
     me: User
    authors: [Author!]!
    author(id: ID!): Author
    books: [Book!]!
    book(id: ID!): Book
  }

  type Mutation {
 register(username: String!, password: String!): User!
  login(username: String!, password: String!): User!

  addAuthor(name: String!): Author!
  addBook(title: String!, genre: String!, authorId: ID!): Book!
  deleteBook(id: ID!): String!
  deleteAuthor(id: ID!): String!
  updateAuthor(id: ID!, name: String!): Author!
  updateBook(id: ID!, title: String, genre: String, authorId: ID): Book!
  }
`;


export default typeDefs;