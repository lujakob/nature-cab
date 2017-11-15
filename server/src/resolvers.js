import USER from './models/user'
import RIDE from './models/ride'
import bcrypt from 'bcrypt'
import {saltRounds} from '../constants'
import {getYesterday} from './utils'

const removePassword = (data) => {
  if (Array.isArray(data)) {
    return data.map(item => {
      item.password = null
      return item
    })
  } else {
    if (!!data) {
      data.password = null
    }

    return data
  }
}

const isEmailValidationError = (err) => {
  return err.errors && err.errors.email && err.errors.email.properties && err.errors.email.properties.type && err.errors.email.properties.type === 'unique'
}

export const resolvers = {
  Query: {
    rides: (root, args, context) => {
      let filter = {}

      // add 'start' filter
      if (args.start && args.start.length > 0) {
        Object.assign(filter, {start: args.start})
      }

      // add 'end' filter
      if (args.end && args.end.length > 0) {
        Object.assign(filter, {end: args.end})
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
    },
    myRides: (root, args, context) => {
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
    },
    ride: (root, {id}, context) => {
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
    },
    users: (root, args, context) => {
      return new Promise((resolve, reject) => {
        USER
          .find((err, users) => {
            if (err) {
              reject(err)
            } else {
              resolve(removePassword(users))
            }
          })
      })
    },
    user: (root, {userId}, context) => {
      return new Promise((resolve, reject) => {
        USER
          .findById(userId, (err, user) =>{
            if (err) {
              reject(err)
            } else {
              resolve(removePassword(user))
            }
          })
      })
    }
  },
  Mutation: {
    addRide: (root, {ride}) => {
      return new Promise((resolve, reject) => {

        const newRide = new RIDE({
          user: ride.user,
          start: ride.start,
          end: ride.end,
          seats: ride.seats,
          price: ride.price,
          activity: ride.activity,
          startDate: ride.startDate,
          returnInfo: ride.returnInfo
        })

        // save ride
        newRide
          .save((err) => {
            if (err) {
              reject(err)
            } else {
              // populate the user for the result to be stored in apollo cache
              newRide.populate('user', (err) => resolve(newRide))
            }
          }).catch(err => console.log(err))
      })
    },
    createUser: (root, {user}) => {

      return new Promise((resolve, reject) => {

        // bcrypt password
        bcrypt.hash(user.password, saltRounds).then(hash => {

          const newUser = new USER({
            gender: user.gender,
            firstname: user.firstname,
            lastname: user.lastname,
            yearOfBirth: user.yearOfBirth,
            email: user.email,
            password: hash
          })

          // save user
          newUser
            .save((err, user) => {
              if (err) {

                if (isEmailValidationError(err)) {
                  reject('VALIDATION_EMAIL_UNIQUE')
                } else {
                  reject(err)
                }
                reject(err)
              } else {
                return resolve(newUser)
              }
            }).catch(err => console.log(err))
          }).catch(err => console.log(err))

      })

    },
    updateUser: (root, {user}) => {
      return new Promise((resolve, reject) => {
        const query = {_id: user._id}
        const update = {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          phone: user.phone,
          yearOfBirth: user.yearOfBirth,
          vehicle: user.vehicle,
          car: user.car,
          carColor: user.carColor,
          description: user.description
        }
        const options = {new: true}

        USER.findOneAndUpdate(query, update, options, (err, updatedUser) => {
          if (err) {
            reject(err)
          } else {
            return resolve(updatedUser)
          }
        })
      })

    }
  },
}
