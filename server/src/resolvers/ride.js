import RIDE from '../models/ride'
import {getYesterday} from '../utils'

export const ridesResolver = (root, args, context) => {
  let filter = {}

  // add 'start' filter
  if (args.start && args.start.length > 0) {
    Object.assign(filter, {startCity: args.start})
  }

  // add 'end' filter
  if (args.end && args.end.length > 0) {
    Object.assign(filter, {endCity: args.end})
  }

  // add 'activity' filter
  if (args.activity && args.activity.length > 0) {
    Object.assign(filter, {activity: args.activity})
  }

  Object.assign(filter, {startDate: {$gt: getYesterday()}})

  return new Promise((resolve, reject) => {
    RIDE
      .find(filter, (err, rides) => {
        if (err) {
          reject(err)
        } else {
          return resolve(rides)
        }
      })
      .populate('user')
      .sort({startDate: 'asc'})
  })
}

export const myRidesResolver = (root, args, context) => {
  return new Promise((resolve, reject) => {
    RIDE
      .find({'user': args.userId}, (err, rides) => {
        if (err) {
          reject(err)
        } else {
          return resolve(rides)
        }
      })
      .populate('user')
      .sort({startDate: 'asc'})
  })
}

export const rideResolver = (root, {id}, context) => {
  return new Promise((resolve, reject) => {
    RIDE
      .findOne({'_id': id}, (err, ride) => {
        if (err) {
          reject(err)
        } else {
          console.log(ride)
          return resolve(ride)
        }
      })
      .populate('user')
  })
}

export const addRideResolver = (root, {ride}) => {
  // add the user only if ride is created
  const data = {
    user: ride.user,
    startLocation: ride.startLocation,
    startCity: ride.startCity,
    startLatLng: ride.startLatLng,
    endLocation: ride.endLocation,
    endCity: ride.endCity,
    endLatLng: ride.endLatLng,
    seats: ride.seats,
    price: ride.price,
    vehicle: ride.vehicle,
    activity: ride.activity,
    startDate: ride.startDate,
    returnInfo: ride.returnInfo
  }

  return new Promise((resolve, reject) => {

  // findOneAndUpdate and upsert opt doesn't really work if querying for the _id -> field _id will not be filled out

    if (ride._id) {

      const query = {_id: ride._id}
      const update = data
      const options = {new: true}

      RIDE
        .findOneAndUpdate(query, update, options)
        .populate('user')
        .exec((err, updatedRide) => {
          if (err) {
            reject(err)
          } else {
            return resolve(updatedRide)
          }
        })
    } else {
      const newRide = new RIDE(data)

      // save ride
      newRide
        .save((err) => {
          if (err) {
            reject(err)
          } else {
            // populate the user for the result to be stored in apollo cache
            return newRide.populate('user', (err) => resolve(newRide))
          }
        }).catch(err => console.log(err))
    }
  })
}