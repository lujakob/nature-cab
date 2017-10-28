import USER from './models/user'
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
      return rideList
    },
    myRides: (root, args, context) => {
      console.log(args)
      console.log(context)
      return rideList.filter(ride => ride.userId === parseInt(args.userId))
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
      const newRide = {
        id: String(nextRideId++),
        userId: ride.userId,
        name: ride.name,
        start: ride.start,
        end: ride.end,
        seats: ride.seats,
        activity: ride.activity
      }
      rideList.push(newRide)
      return newRide
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

              resolve(newUser)
              return newUser
            }
          })
        }).catch(err => console.log(err))

      })

    }
  },
}
