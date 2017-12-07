import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import USER from '../models/user'
import RIDE from '../models/ride'
import moment from 'moment'
import 'moment/locale/de'
import {users} from './user'
import {rides} from './ride'

import {saltRounds} from '../../config'

// store save promises here to exit after all resolved
let userSavePromises = []
let rideSavePromises = []

mongoose.connect('mongodb://localhost:27017/naturecab', {useMongoClient: true})
const db = mongoose.connection

db.on('error', ()=> {
  console.log( '---FAILED to connect to mongoose')
})

db.once('open', () => {
  console.log( '+++Connected to mongoose')
})

// drop UserList collection
db.dropCollection('UserList').then((err, result) => {
  if (err) {
    console.log('---Drop collection UserList failed ' + err)
  } else {
    console.log('+++Drop collection UserList successfully')
  }
})

// drop RideList collection
db.dropCollection('RideList').then((err, result) => {
  if (err) {
    console.log('---Drop collection RideList failed ' + err)
  } else {
    console.log('+++Drop collection RideList')
  }
})


// insert users into UserList
users.map(user => {

  let savePromise = bcrypt.hash(user.password, saltRounds).then(hash => {

    let newUser = new USER(Object.assign({}, user, {password: hash}))

    return newUser.save((err, result) => {

      if (err) {
        console.log('---User save failed ' + err)
      } else {
        console.log('+++User ' + result._id +  ' saved.')
      }

    }).catch(e => console.log(e))

  })

  // store save promises here to exit after all resolved
  userSavePromises.push(savePromise)
})


// create rides, once the users are created
Promise.all(userSavePromises).then((users) => {

  const preparedRides = addUserId(rides, users)

  preparedRides.map(ride => {
    let newRide = new RIDE(ride)

    let rideSavePromise = newRide.save((err, result) => {
      if (err) {
        console.log('---Ride save failed ' + err)
      } else {
        console.log('+++Ride ' + result.id + ' saved.')
      }
    })

    // store save promises here to exit after all resolved
    rideSavePromises.push(rideSavePromise)

  })

  // disconnect to exit node script, when all save's are resolved
  Promise.all(rideSavePromises).then(() => {
    mongoose.disconnect()
  })
})

/**
 * rides mock elements prop 'user' is the index of the mock users element
 * replace 'user' prop index value by it's 'user' _id
 * @param rides
 * @param users
 * @returns {*}
 */
function addUserId(rides, users) {
  return rides.map(ride => {
    ride['user'] = users[ride['user']]['_id']
    return ride
  })
}