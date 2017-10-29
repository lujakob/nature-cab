import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from 'graphql-tools';

import { resolvers } from './resolvers';

const typeDefs = `
type Ride {
  id: ID!
  userId: Int!
  name: String!
  start: String!
  end: String!
  activity: String!
  seats: Int!
}

input RideInput {
  name: String!
  userId: Int!
  start: String!
  end: String!
  activity: String!
  seats: Int!
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
  rides(start: String, end: String): [Ride]
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


const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };
