/**
 * getYesterday returns date object from yesterday
 */
export const getYesterday = () => {
  let date = new Date()
  return date.setDate(date.getDate() - 1)
}