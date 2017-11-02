import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import USER from './src/models/user'
import RIDE from './src/models/ride'
import moment from 'moment'
import 'moment/locale/de'

import {saltRounds, ACTIVITIES} from './constants'

// store save promises here to exit after all resolved
let savePromises = []

mongoose.connect('mongodb://localhost:27017/naturecab', {useMongoClient: true})
const db = mongoose.connection

db.on('error', ()=> {
  console.log( '---FAILED to connect to mongoose')
})

db.once('open', () => {
  console.log( '+++Connected to mongoose')
})

// reset autoincrement counter on user list
mongoose.model('User').resetCount((err) => {
  console.log('+++Reset count on UserList successfully')
})

// drop UserList collection
db.dropCollection('UserList').then((err, result) => {
  if (err) {
    console.log('---Drop collection UserList failed ' + err)
  } else {
    console.log('+++Drop collection UserList successfully')
  }
})

// insert users into UserList
const users = [
  {email: 'test', password: 'test', name: 'test'},
  {email: 'tom@tom.de', password: 'test', name: 'Tom'},
  {email: 'lukas@lukas.de', password: 'test', name: 'Lukas'}
]

users.map(user => {

  let savePromise = bcrypt.hash(user.password, saltRounds).then(hash => {

    let newUser = new USER(Object.assign({}, user, {password: hash}))

    return newUser.save((err, result) => {

      if (err) {
        console.log('---User save failed ' + err)
      } else {
        console.log('+++User ' + result.userId +  ' saved.')
      }

    })

  })

  // store save promises here to exit after all resolved
  savePromises.push(savePromise)

})

// drop UserList collection
db.dropCollection('RideList').then((err, result) => {
  if (err) {
    console.log('---Drop collection RideList failed ' + err)
  } else {
    console.log('+++Drop collection RideList')
  }
})


// insert users into UserList
moment.locale('de')

const rideList = [
  {userId: 1, start: 'Munich', end: 'Garmisch', seats: 3, activity: ACTIVITIES.HIKE, id: 1, startDate: moment().add(-1, 'days').toDate()},
  {userId: 2, start: 'Munich', end: 'Tegernsee', seats: 2, activity: ACTIVITIES.HIKE, id: 2, startDate: moment().toDate()},
  {userId: 1, start: 'Augsburg', end: 'Spitzingsee', seats: 2, activity: ACTIVITIES.TRAILRUN, id: 3, startDate: moment().add(4, 'days').toDate()},
  {userId: 1, start: 'Munich', end: 'Garmisch', seats: 2, activity: ACTIVITIES.TRAILRUN, id: 4, startDate: moment().add(4, 'days').toDate()}
]

rideList.map(ride => {
  let newRide = new RIDE(ride)

  let savePromise = newRide.save((err, result) => {
    if (err) {
      console.log('---Ride save failed ' + err)
    } else {
      console.log('+++Ride ' + result.id + ' saved.')
    }
  })

  // store save promises here to exit after all resolved
  savePromises.push(savePromise)

})

// disconnect to exit node script, when all save's are resolved
Promise.all(savePromises).then(() => {
  mongoose.disconnect()
})