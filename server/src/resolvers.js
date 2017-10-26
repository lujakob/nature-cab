const rideList = [
  {name: 'Lukas', start: 'Munich', end: 'Garmisch', seats: 3, activity: 'Hike', id: 1},
  {name: 'Tom', start: 'Munich', end: 'Tegernsee', seats: 2, activity: 'Hike', id: 2},
  {name: 'Lisa', start: 'Munich', end: 'Spitzingsee', seats: 2, activity: 'Bike', id: 3}
]

let nextRideId = 4;

export const resolvers = {
  Query: {
    rides: () => {
      return rideList;
    },
    ride: (root, {id}) => {
      return rides.find(ride => ride.id === id);
    }
  },
  Mutation: {
    addRide: (root, {ride}) => {
      const newRide = {
        id: String(nextRideId++),
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
};
