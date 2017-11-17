import {authenticated} from './utils'
import {userResolver, usersResolver, createUserResolver, updateUserResolver} from './resolvers/user'
import {ridesResolver, myRidesResolver, rideResolver, addRideResolver} from './resolvers/ride'

export const resolvers = {
  Query: {
    rides: ridesResolver,
    ride: rideResolver,
    myRides: myRidesResolver,
    users: usersResolver,
    user: authenticated(userResolver)
  },
  Mutation: {
    addRide: addRideResolver,
    createUser: createUserResolver,
    updateUser: updateUserResolver
  }
}
