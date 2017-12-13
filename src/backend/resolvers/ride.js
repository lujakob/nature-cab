import RIDE from '../models/ride'
import {getYesterday} from '../utils'

export const ridesResolver = (root, args, context) => {
  let filter = {}

  const {start, end, activity, limit} = args

  // add 'start' filter
  if (start && start.length > 0) {
    Object.assign(filter, {startCity: start})
  }

  // add 'end' filter
  if (end && end.length > 0) {
    Object.assign(filter, {endCity: end})
  }

  // add 'activity' filter
  if (activity && activity.length > 0) {
    Object.assign(filter, {activity: activity})
  }

  Object.assign(filter, {startDate: {$gt: getYesterday()}})

  const RidesPromise = new Promise((resolve, reject) => {
    const query = RIDE.find(filter)

    query.populate('user')
    query.sort({startDate: 'asc'})

    // add 'limit'
    if (limit && limit > 0) {
      query.limit(limit)
    }

    query.exec((err, rides) => {

        if (err) {
          reject(err)
        } else {
          return resolve(rides)
        }
      })
  })

  const TotalPromise = new Promise((resolve, reject) => {
    RIDE
      .count(filter, (err, count) => {
        if (err) {
          reject(err)
        } else {
          return resolve(count)
        }
      })
  })

  return Promise.all([RidesPromise, TotalPromise]).then((data) => {
    return {
      rides: data[0],
      total: data[1]
    }
  }).catch(e => console.log(e))
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