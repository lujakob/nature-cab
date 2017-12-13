import {ACTIVITIES} from '../constants'
import moment from 'moment'
import 'moment/locale/de'

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
      console.log("Validation error", prop)
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

/**
 * getActivityFromId - get activity title from id
 * @param id
 * @returns {string}
 */
export const getActivityFromId = (id) => {
  let activity = ACTIVITIES[id]
  return activity ? activity['title'] : ''
}

/**
 * getFormattedDate - return date and time, 'today' for current day, otherwise date
 * @param date
 * @returns {string}
 */
export const getFormattedDate = (date) => {
  let day = isToday(date) ? 'Heute' : moment(new Date(date)).format('ddd D.MMM')
  let time = moment(new Date(date)).format('kk:mm')

  return `${day} - ${time} Uhr`
}

function isToday(date) {
  return moment(new Date(date)).isSame(moment(), 'day')
}

export const isNormalInteger = (str) => {
  let n = Math.floor(Number(str))
  return String(n) === str && n >= 0
}

export const getVehicleTitleByKey = (value, vehicles) => {
  let el = vehicles.find(el => el.value === value)
  return el ? el['title'] : ''
}

export const vehicleIsCar = (value, vehicles) => {
  return value === vehicles[0]['value']
}

export const getSortedActivities = (activities) => {
  // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  const compareFunc = (a, b) => {
    const nameA = a.title.toUpperCase()
    const nameB = b.title.toUpperCase()
    if (nameA < nameB) {
      return -1
    }
    if (nameA > nameB) {
      return 1
    }

    return 0
  }
  
  activities.sort(compareFunc)
  
  return activities
}