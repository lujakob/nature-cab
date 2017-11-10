import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import USER from './src/models/user'
import RIDE from './src/models/ride'
import moment from 'moment'
import 'moment/locale/de'

import {saltRounds, ACTIVITIES} from './constants'

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

// drop UserList collection
db.dropCollection('RideList').then((err, result) => {
  if (err) {
    console.log('---Drop collection RideList failed ' + err)
  } else {
    console.log('+++Drop collection RideList')
  }
})


// insert users into UserList
const users = [
  {email: 'test', password: 'test', firstname: 'test', lastname: 'test', yearOfBirth: 1988, car: 'VW Golf', carColor: 'grün'},
  {email: 'tom@tom.de', password: 'test', firstname: 'Tom', lastname: 'Dooley', yearOfBirth: 1988, car: 'Mercedes Benz', carColor: 'blau'},
  {email: 'lukas@jackson.de', password: 'test', firstname: 'Lukas', lastname: 'Jackson', yearOfBirth: 1988, car: 'VW Caddy', carColor: 'anthrazit grau'}
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
  userSavePromises.push(savePromise)

})


// create rides, once the users are created
Promise.all(userSavePromises).then(() => {
  // insert users into UserList
  moment.locale('de')

  USER.find((err, users) => {
    if(err) {
      console.log('--- failed to find all Users')
    } else {

      const rideList = [
        {userId: 1, start: 'München', end: 'Garmisch', seats: 3, price: 20, activity: ACTIVITIES[1]['id'], id: 1, startDate: moment().add(-1, 'days').startOf('hour').toDate(), user: users[0]._id},
        {userId: 2, start: 'München', end: 'Tegernsee', seats: 2, price: 28, activity: ACTIVITIES[1]['id'], id: 2, startDate: moment().startOf('hour').toDate(), user: users[1]._id, returnInfo: 'Ich würde gerne um 16 Uhr am Parkplatz zurück sein und dann gemütlich heimfahren.'},
        {userId: 1, start: 'Augsburg', end: 'Spitzingsee', seats: 2, price: 28, activity: ACTIVITIES[2]['id'], id: 3, startDate: moment().add(4, 'days').startOf('hour').toDate(), user: users[0]._id, returnInfo: 'Wir können gerne zusammen laufen gehen. Ich denke Tempo mittel, 2h hoch und 1h runter.'},
        {userId: 1, start: 'München', end: 'Garmisch', seats: 2, price: 30, activity: ACTIVITIES[1]['id'], id: 4, startDate: moment().add({days: 4, hours: 2}).startOf('hour').toDate(), user: users[0]._id}
      ]

      rideList.map(ride => {
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
    }
  })
})