import * as prototypes from './prototype/index'
function setPrototype(main, obj) {
  Object.keys(obj).forEach((item) => {
    let key = '$' + item
    main.prototype[key] = obj[item]
  })
}
export default function install(Vue) {
  setPrototype(Vue, prototypes)
}