// 函数的防抖-控制函数在某个动作出发之后n秒时间后执行，如果中间被打断了那么继续等待n秒
function debounce(func, wait) {
  let timeout, args, context, timestamp
  function later() {
    const last = new Date() - timestamp
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      func.apply(context, args)
    }
  }
  return function() {
    context = this
    args = arguments
    timestamp = new Date()
    if (!timeout) {
      timeout = setTimeout(later, wait)
    }
  }
}
// 函数节流-控制函数的执行频率，连续出发事件，但是在n秒钟只执行一次
function throttle(func, wait) {
  let timeout
  return function (arg) {
    if (!timeout) {
      timeout = setTimeout(function() {
        func.apply(undefined, arg)
        clearTimeout(timeout)
        timeout = null
      }, wait)
    }
  }
}
// 对象或者数组深拷贝
function deepCopy(param) {
  const isObj = Object.prototype.toString.call(param) === '[object Object]'
  if (!Array.isArray(param) && !isObj) {
    throw new TypeError('deepCopy`s first param needs array || object')
  } else {
    const result = Array.isArray(param) ? [] : {}
    for (const item in param) {
      if (Object.prototype.toString.call(item) === '[object Object]' && param[item] !== null) {
        result[item] = deepCopy(param[item])
      } else {
        result[item] = param[item]
      }
    }
    return result
  }
}
// 谓词函数否
function completeNo (func) {
  return function (...arg) {
    return !func(arg)
  }
}
// 谓词函数或
function competeOr (func1, func2) {
  return function (...arg) {
    return func1(arg) || func2(arg)
  }
}
// 谓词函数且
function competeAnd (func1, func2) {
  return function (...arg) {
    return func1(arg) && func2(arg)
  }
}
// 函数柯里化
/**
 * 
 * @param {function} fn 
 * @param {number} length 
 * @return {function}
 */
function curry(fn, length) {
  function _cur (saveArg) {
    return function(...arg) {
      if (arg === undefined || arg === null) {
        return _cur(saveArg)
      }
      let param = saveArg.contact(arg)
      if (param >= length) {
        fn(param)
      } else {
        return _cur(param)
      }
    }
  } 
  _cur([])
}
// 控制input的内容为整型数字
function setInter(value) {
  value = String(value)
  const po = value.indexOf('.')
  const mid = po === -1 ? value : value.substring(0, po + 1)
  const re = mid.replace(/[^\d]/g, '')
  if (re === '') {
    return 0
  } else {
    return parseInt(re)
  }
}
// 设置小数
function setPart(value) {
  let re =  String(value).replace(/[^\d.]/g, '')
  re = re.replace(/^\./g, '')
  re = re.replace(/\.{2,}/g, '.')
  re = re.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
  let index = re.indexOf('.')
  if (index < 0 && re !== '') {
    re = parseFloat(re)
  }
  if (index > 1) {
    let pre = re.substring(0, index)
    let end = re.substring(index)
    pre = pre.length > 1 ? pre.replace(/^0{1,}/, '') : pre
    pre = pre === '' ? '0' : pre
    re = pre + end
  }
  return re
}
export {debounce, deepCopy, throttle, competeAnd, competeOr, completeNo, curry, setInter, setPart}
