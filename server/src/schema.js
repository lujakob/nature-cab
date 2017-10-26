import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from 'graphql-tools';

import { resolvers } from './resolvers';

const typeDefs = `
type Ride {
  id: ID!
  userId: String!
  name: String!
  start: String!
  end: String!
  activity: String!
  seats: String!
}

input RideInput {
  name: String!
  userId: String!
  start: String!
  end: String!
  activity: String!
  seats: String!
}

type User {
  id: ID!
  name: String!
  email: String!
  password: String!
}

input UserInput {
  name: String!
  email: String!
  password: String!
}

type Query {
  rides: [Ride]
  ride(id: ID!): Ride
  myRides(userId: ID!): [Ride]
  user(id: ID!): User
}


type Mutation {
  addRide(ride: RideInput!): Ride
  createUser(user: UserInput): User
}
`;


const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };
