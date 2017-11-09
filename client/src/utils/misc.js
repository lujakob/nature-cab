/**
 * check props for not empty
 * @param dataObj
 * @returns {boolean}
 * @private
 */
export const formIsValid = (dataObj, skipFields) => {
  for (let prop in dataObj) {
    let isMandatory = !skipFields.includes(prop)

    if (isMandatory && !dataObj[prop]) {
      return false
    }
  }
  return true
}

/**
 * getYearOfBirthOptions - returns array of all birthyears older than currently 18 - max 80 elements
 * @returns {Array}
 */
export const getYearOfBirthOptions = (limit = 80) => {
  let result = []
  let startYear = (new Date()).getFullYear() - 18
  let stopYear = startYear - limit

  while(startYear > stopYear) {
    result.push(startYear)
    startYear--
  }
  return result
}

export const getAgeFromYearOfBirth = (yearOfBirth) => {
  let currentYear = (new Date()).getFullYear()
  return currentYear - yearOfBirth
}

export const truncateName = (name) => {
  return name.substr(0, 1) + '.'
}