import {users} from '../server'
import USER from './user'

let nextRideId = 4

let nextUserId = 3

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
      const newUser = new USER({
        name: user.name,
        email: user.email,
        password: user.password
      })

      return new Promise((resolve, reject) => {
        newUser.save((err, user) => {
          if (err) {
            console.log('---TodoItem save failed ' + err)
            reject(err)
          } else {
            console.log('+++TodoItem saved successfully ' + user)
            resolve(newUser)
            return newUser
          }
        })
      })




    }
  },
}
