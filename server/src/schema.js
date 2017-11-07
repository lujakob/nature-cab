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
  price: Int!
  startDate: String!
  returnInfo: String
}

input RideInput {
  userId: Int!
  start: String!
  end: String!
  activity: String!
  seats: Int!
  price: Int!
  startDate: String!
  returnInfo: String
}

type User {
  _id: ID!
  userId: Int!
  gender: String
  firstname: String!
  lastname: String!
  email: String!
  phone: String
  password: String
  yearOfBirth: String!
  car: String
}

input UserInput {
  gender: String!
  firstname: String!
  lastname: String!
  email: String!
  password: String!
  yearOfBirth: String!
}

input UserUpdateInput {
  userId: Int!
  firstname: String!
  lastname: String!
  email: String!
  phone: String
  yearOfBirth: String!
  car: String
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
