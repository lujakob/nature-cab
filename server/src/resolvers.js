import USER from './models/user'
import RIDE from './models/ride'
import bcrypt from 'bcrypt'
import {saltRounds} from '../constants'

let nextRideId = 4

const rideList = [
  {userId: 1, name: 'Lukas', start: 'Munich', end: 'Garmisch', seats: 3, activity: 'Hike', id: 1},
  {userId: 2, name: 'Tom', start: 'Munich', end: 'Tegernsee', seats: 2, activity: 'Hike', id: 2},
  {userId: 1, name: 'Lukas', start: 'Munich', end: 'Spitzingsee', seats: 2, activity: 'Bike', id: 3}
]

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
      return new Promise((resolve, reject) => {
        RIDE.find((err, rides) => {
          if (err) {
            reject(err)
          } else {
            return resolve(rides)
          }
        })
      })
    },
    myRides: (root, args, context) => {
      return new Promise((resolve, reject) => {
        RIDE.find({'userId': args.userId}, (err, rides) => {
          if (err) {
            reject(err)
          } else {
            return resolve(rides)
          }
        })
      })
    },
    ride: (root, {id}, context) => {
      return rides.find(ride => ride.id === id)
    },
    users: (root, args, context) => {
      return new Promise((resolve, reject) => {
        USER.find((err, users) => {
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
        USER.findOne({userId: userId}, (err, user) =>{
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
          userId: ride.userId,
          name: ride.name,
          start: ride.start,
          end: ride.end,
          seats: ride.seats,
          activity: ride.activity
        })

        // save ride
        newRide.save((err, ride) => {
          if (err) {
            reject(err)
          } else {
            console.log(newRide);
            return resolve(newRide)

          }
        }).catch(err => console.log(err))
      })
    },
    createUser: (root, {user}) => {

      return new Promise((resolve, reject) => {

        // bcrypt password
        bcrypt.hash(user.password, saltRounds).then(hash => {

          const newUser = new USER({
            name: user.name,
            email: user.email,
            password: hash
          })

          // save user
          newUser.save((err, user) => {
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

    }
  },
}
