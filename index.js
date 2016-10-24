/**
 * Dependencies.
 */

var promise = require('bluff')


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
    if(value != null) data[key] = typeof value == 'function' ? value.call(data) : value
    else return function(val) {
      return store.set(key, val)
    }
    return store
  }

  store.del = function(key) {
    delete data[key]
  }

  return store
}
