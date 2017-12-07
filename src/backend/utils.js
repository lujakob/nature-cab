import {JWT_SECRET} from '../config'
import jwt from 'jsonwebtoken'

/**
 * getYesterday returns date object from yesterday
 */
export const getYesterday = () => {
  let date = new Date()
  return date.setDate(date.getDate() - 1)
}

/**
 * authenticated compose function to authenticate
 * @param fn
 */
export const authenticated = (fn) =>
    (parent, args, context, info) => {
      if (context.user) {
        return fn(parent, args, context, info);
      }
      return fn(parent, args, context, info);

      // throw new Error('UNAUTHORIZED');
    }

/**
 * isEmailValidationError
 * @param err
 * @returns {*|Runtime.PropertyPreview[]|Object|String|boolean}
 */
export const isEmailValidationError = (err) => {
  const {errors} = err
  return errors && errors.email && errors.email.properties && errors.email.properties.type && errors.email.properties.type === 'unique'
}

/**
 * removePassword
 * @param data
 * @returns {*}
 */
export const removePassword = (data) => {
  if (Array.isArray(data)) {
    return data.map(item => {
      delete item.password
      return item
    })
  } else {
    if (!!data) {
      delete data.password
    }

    return data
  }
}

export const getJWT = (user) => {
  let payload = {_id: user._id}
  return jwt.sign(payload, JWT_SECRET)
}