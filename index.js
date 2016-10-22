

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
    data[key] = value
    return store
  }

  return store
}
