// utils/validator.js
export function isUrl(str) {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}

export function isEmpty(val) {
  return val === undefined || val === null || val === ''
}

export function isNumber(val) {
  return !isNaN(val)
}