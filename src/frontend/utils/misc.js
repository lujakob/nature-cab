import {ACTIVITIES} from '../../constants'
import moment from 'moment'
import 'moment/locale/de'
import {endParamPrefix, activityParamPrefix} from '../../constants'

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
  let activity = ACTIVITIES.find(el => parseInt(el.id, 10) === parseInt(id, 10))
  return activity ? activity['title'] : ''
}

/**
 * getActivityIdFromTitle - get activity id from title
 * @param title
 * @returns {null}
 */
export const getActivityIdFromTitle = (title) => {
  let targetEl = ACTIVITIES.find(el => el.title.toLowerCase() === title.toLowerCase())
  return targetEl ? targetEl['id'] : null
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
  // element[0] of vehicles is 'car'
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

/**
 * isMobile - checking mobile device by window with. return false if window is undefined, server side
 * @returns {Window|*|boolean}
 */
export const isMobile = () => {
  const mobileBreakPoint = 768
  return window && window.innerWidth < mobileBreakPoint
}

export const upperCaseFirst = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * replace 'umlaut' - transform string to url
 * @param str
 * @returns {string}
 */
export const strToUrl = (str) => {
  return str
    .toLowerCase()
    .replace(/\u00fc/g, 'ue')
    .replace(/\u00e4/g, 'ae')
    .replace(/\u00f6/g, 'oe')
    .replace(/\u00df/g, 'ss')
    .replace(/\s/g, '-')
}

export const urlToStr = (str) => {
  return upperCaseFirst(
    str
      .replace(/ue/gi, "ü")
      .replace(/ae/gi, 'ä')
      .replace(/oe/gi, 'ö')
      .replace(/-/g, ' ')
  )
}


/**
 * add url params to base path if available - add specific prefix 'zum-', 'nach-', replace umlaut
 * @param start
 * @param end
 * @param activity
 * @returns {string}
 * @private
 */
export const ridesBuildUrl = (basePath, {start, end, activity}) => {
  let url = basePath

  if (start) {
    url = url + '/' + strToUrl(start)
  }
  if (end) {
    url = url + '/' + endParamPrefix + strToUrl(end)
  }
  if (activity) {
    url = url + '/' + activityParamPrefix + strToUrl(getActivityFromId(activity))
  }

  return url
}

export const getUserMailToHref = (email, firstname) => {
  return `mailto:${email}?subject=NatureCab Mitfahrgelegenheit Anfrage&body=Hallo ${firstname},`
}