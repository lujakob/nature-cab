const isNode = typeof window === 'undefined'

const LocalStorage = !isNode
  ? window.localStorage
  : {getItem() {}, removeItem() {}, setItem() {console.log("localstorage mock")}}

export default LocalStorage