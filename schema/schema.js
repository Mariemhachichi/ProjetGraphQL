import { makeExecutableSchema } from '@graphql-tools/schema';
import Book from '../models/Book.js';

const typeDefs = `
  type Book {
    id: ID!
    title: String!
    author: String!
  }

  type Query {
    books: [Book!]!
    book(id: ID!): Book
  }

  type Mutation {
    addBook(title: String!, author: String!): Book
    deleteBook(id: ID!): Book
  }
`;

const resolvers = {
  Query: {
    books: async () => await Book.find(),
    book: async (_, { id }) => await Book.findById(id),
  },
  Mutation: {
    addBook: async (_, { title, author }) => {
      const newBook = new Book({ title, author });
      return await newBook.save();
    },
    deleteBook: async (_, { id }) => {
      return await Book.findByIdAndDelete(id);
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
