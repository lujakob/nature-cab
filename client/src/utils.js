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