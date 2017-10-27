import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import USER from './src/user'

import saltRounds from './constants'

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
  console.log("+++Reset count on UserList successfully")
})

// drop UserList collection
db.dropCollection('UserList').then((err, result) => {
  if (err) {
    console.log("---Drop collection UserList failed " + err)
  } else {
    console.log("+++Drop collection UserList successfully")
  }
})

// store save promises here to exit after all resolved
let savePromises = []

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
        console.log("---User save failed " + err)
      } else {
        console.log("+++User " + result.userId + " saved successfully")
      }

    })

  })

  // store save promises here to exit after all resolved
  savePromises.push(savePromise)

})

// disconnect to exit node script, when all save's are resolved
Promise.all(savePromises).then(() => {
  mongoose.disconnect()
})