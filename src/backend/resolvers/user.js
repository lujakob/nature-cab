import USER from '../models/user'
import bcrypt from 'bcrypt'
import {saltRounds} from '../../config'
import {removePassword, isEmailValidationError} from '../utils'

export const userResolver = (root, {userId}, context) => {
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

export const usersResolver = (root, args, context) => {
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
}

export const createUserResolver = (root, {user}) => {

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
              return reject('VALIDATION_EMAIL_UNIQUE')
            } else {
              return reject(err)
            }
            return reject(err)
          } else {
            return resolve(newUser)
          }
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))

  })
}

export const updateUserResolver = (root, {user}) => {
  return new Promise((resolve, reject) => {
    const query = {_id: user._id}
    const update = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      yearOfBirth: user.yearOfBirth,
      carType: user.carType,
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
