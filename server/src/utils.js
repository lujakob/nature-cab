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

      throw new Error('UNAUTHORIZED');
    }

/**
 * isEmailValidationError
 * @param err
 * @returns {*|Runtime.PropertyPreview[]|Object|String|boolean}
 */
export const isEmailValidationError = (err) => {
  return err.errors && err.errors.email && err.errors.email.properties && err.errors.email.properties.type && err.errors.email.properties.type === 'unique'
}