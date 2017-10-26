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

type Query {
  rides: [Ride]
  ride(id: ID!): Ride
  myRides(userId: ID!): [Ride]
}


type Mutation {
  addRide(ride: RideInput!): Ride
}
`;


const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };
