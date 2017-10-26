const rideList = [
  {userId: 1, name: 'Lukas', start: 'Munich', end: 'Garmisch', seats: 3, activity: 'Hike', id: 1},
  {userId: 2, name: 'Tom', start: 'Munich', end: 'Tegernsee', seats: 2, activity: 'Hike', id: 2},
  {userId: 1, name: 'Lukas', start: 'Munich', end: 'Spitzingsee', seats: 2, activity: 'Bike', id: 3}
]

let nextRideId = 4

export const resolvers = {
  Query: {
    rides: (root, args, context) => {
      return rideList
    },
    myRides: (root, args, context) => {
      console.log(args)
      return rideList.filter(ride => ride.userId === parseInt(args.userId))
    },
    ride: (root, {id}, context) => {
      return rides.find(ride => ride.id === id)
    }
  },
  Mutation: {
    addRide: (root, {ride}) => {
      const newRide = {
        id: String(nextRideId++),
        userId: ride.userId,
        name: ride.name,
        start: ride.start,
        end: ride.end,
        seats: ride.seats,
        activity: ride.activity
      };
      rideList.push(newRide);
      return newRide;
    }
  },
}
