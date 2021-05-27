export function isEmpty(str) {
  return !str || 0 === str.length
}
export const evalFunc = (value, props = undefined) => (typeof value === "function" ? value(props) : value)

export const objArray = (obj) => Object.keys(obj).map((k) => obj[k])

export const reduceArrayObject = (array) =>
  array.reduce((obj, item, index) => {
    return {
      ...obj,
      [index]: item,
    }
  }, {})

// Checks for any error at the first object/key level
export const anyError = (errors, key = undefined) => {
  var error = false
  Object.keys(errors).forEach((k) => {
    if (isEmpty(key) || key === k) {
      if (!isEmpty(errors[k])) {
        error = true
      }
    }
  })
  return error
}

// Checks for any error at the second object/key level
export const anyErrorSecond = (errors, key = undefined) => {
  var error = false
  Object.keys(errors).forEach((k) =>
    Object.keys(errors[k]).forEach((k2) => {
      if (isEmpty(key) || key === k2) {
        if (!isEmpty(errors[k][k2])) {
          error = true
        }
      }
    })
  )
  return error
}

export const setError = (obj, k1, k2, error) => {
  if (!obj[k1]) {
    obj[k1] = {}
  }
  obj[k1][k2] = error
}
