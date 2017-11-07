import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from 'graphql-tools';

import { resolvers } from './resolvers';

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

input UserUpdateInput {
  userId: Int!
  name: String!
  email: String!
}

type Query {
  rides(start: String, end: String, activity: String): [Ride]
  ride(id: ID!): Ride
  myRides(userId: ID!): [Ride]
  users: [User]
  user(userId: ID!): User
}


type Mutation {
  addRide(ride: RideInput!): Ride
  createUser(user: UserInput!): User
  updateUser(user: UserUpdateInput!): User
}
`;


const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };
