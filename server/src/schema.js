import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from 'graphql-tools';

import { resolvers } from './resolvers';

const typeDefs = `
type Ride {
  _id: ID!
  start: String!
  end: String!
  activity: String!
  seats: Int!
  price: Int!
  startDate: String!
  returnInfo: String
  user: User 
}

input RideInput {
  start: String!
  end: String!
  activity: String!
  seats: Int!
  price: Int!
  startDate: String!
  returnInfo: String
  user: String!
}

type User {
  _id: ID!
  gender: String!
  firstname: String!
  lastname: String!
  email: String!
  phone: String
  password: String
  yearOfBirth: String!
  car: String
  carColor: String
  description: String
}

input UserInput {
  gender: String!
  firstname: String!
  lastname: String!
  email: String!
  password: String!
  yearOfBirth: String!
  car: String
  carColor: String
}

input UserUpdateInput {
  _id: String!
  firstname: String!
  lastname: String!
  email: String!
  phone: String
  yearOfBirth: String!
  car: String
  carColor: String
  description: String
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
