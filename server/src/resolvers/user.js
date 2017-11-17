import USER from '../models/user'
import bcrypt from 'bcrypt'
import {saltRounds} from '../../constants'

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

export const updateUserResolver = (root, {user}) => {
  return new Promise((resolve, reject) => {
    const query = {_id: user._id}
    const update = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      yearOfBirth: user.yearOfBirth,
      vehicle: user.vehicle,
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