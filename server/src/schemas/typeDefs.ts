import gql from 'graphql-tag';

const typeDefs = gql`
  type Book {
    _id: ID
    bookId: String!
    title: String!
    authors: [String]
    description: String!
    image: String
    link: String
  }

  type User {
    _id: ID
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]
    bookCount: Int
  }

  input BookInput{
    bookId: String!
    title: String!
    description: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }

  type Query {
    getSingleUser(userId: ID!): User
  }

  type Mutation {
    createUser(input: UserInput!): Auth
    login(email: String!, password: String!): Auth

    saveBook(input: BookInput!): Book
    deleteBook(bookId: ID!): Book
  }
`;

export default typeDefs;
