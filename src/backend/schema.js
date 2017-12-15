import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from 'graphql-tools';

import { resolvers } from './resolvers';

const typeDefs = `
type Ride {
  _id: ID!
  startLocation: String!
  startCity: String!
  startLatLng: [Float]
  endLocation: String!
  endCity: String!
  endLatLng: [Float]
  activity: String!
  seats: Int!
  price: Int!
  vehicle: String!
  startDate: String!
  description: String
  user: User 
}

input RideInput {
  _id: ID
  startLocation: String!
  startCity: String!
  startLatLng: [Float]
  endLocation: String!
  endCity: String!
  endLatLng: [Float]
  activity: String!
  seats: Int!
  price: Int!
  vehicle: String!
  startDate: String!
  description: String
  user: String!
}

type RidesResult {
  total: Int
  rides: [Ride]
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
  carType: String
  carColor: String
  description: String
  picture: String
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
  _id: String!
  firstname: String!
  lastname: String!
  email: String!
  phone: String
  yearOfBirth: String!
  carType: String
  carColor: String
  description: String
}

type Query {
  rides(start: String, end: String, activity: String, limit: Int): RidesResult
  ride(id: ID!): Ride
  myRides(userId: ID!): [Ride]
  users: [User]
  user(userId: ID): User
}


type Mutation {
  addRide(ride: RideInput!): Ride
  createUser(user: UserInput!): User
  updateUser(user: UserUpdateInput!): User
}
`;


const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };
