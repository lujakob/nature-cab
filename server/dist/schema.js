"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tools_1 = require("graphql-tools");
const resolvers_1 = require("./resolvers");
const typeDefs = `
type Ride {
  id: ID!
  userId: Int!
  start: String!
  end: String!
  activity: String!
  seats: Int!
  startDate: String!
  returnInfo: String
}

input RideInput {
  userId: Int!
  start: String!
  end: String!
  activity: String!
  seats: Int!
  startDate: String!
  returnInfo: String
}

type User {
  _id: ID!
  userId: Int!
  name: String!
  email: String!
  password: String
}

input UserInput {
  name: String!
  email: String!
  password: String!
}

type Query {
  rides(start: String, end: String, activity: String): [Ride]
  ride(id: ID!): Ride
  myRides(userId: ID!): [Ride]
  users: [User]
  user(userId: Int!): User
}


type Mutation {
  addRide(ride: RideInput!): Ride
  createUser(user: UserInput!): User
}
`;
const schema = graphql_tools_1.makeExecutableSchema({ typeDefs, resolvers: resolvers_1.resolvers });
exports.schema = schema;
//# sourceMappingURL=schema.js.map