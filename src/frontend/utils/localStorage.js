import ExecutionEnvironment from 'exenv'

const LocalStorage = ExecutionEnvironment.canUseDOM
  ? window.localStorage
  : {getItem() {}, removeItem() {}, setItem() {console.log("localstorage mock")}}

export default LocalStorage