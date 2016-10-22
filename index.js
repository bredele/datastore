

/**
 *
 */

module.exports = function(data) {

  data = data || {}

  var store = {}

  store.get = function(key) {
    return data[key]
  }

  store.set = function(key, value) {
    if(value != null) {
      if(typeof value == 'function') value = value.call(data)
      data[key] = value
    } else return function(val) {
      return store.set(key, val)
    }
    return store
  }

  return store
}
