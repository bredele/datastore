/**
 * Dependencies.
 */

var promise = require('bluff')
var memory = require('./lib/memory')


/**
 *
 */

module.exports = function(data) {

  data = data || {}

  var store = {}

  var adapter = memory(data)


  /**
   * Get value associated to a key (synchronous version)
   *
   * @param {Any} key
   * @return value associated to the key, or undefined if there is none
   * @api public
   */

  store.get = function(key) {
    return data[key]
  }


  /**
   * Sets the value for the key in the datastore.
   *
   * @param {Any} key
   * @param {Any} value
   * @return {Promise}
   * @api public
   */

  store.set = function(key, value) {
    var cb = function(val) {
      return promise(function(resolve) {
          adapter.set(function(key, entry) {
            resolve(entry)
          }, key, val)
      })
    }
    return value == null ? cb : cb(value)
  }


  /**
   * Removes any value associated to the key.
   *
   * @param {Any} key
   * @api public
   */

  store.del = function(key) {
    return promise(function(resolve) {
      adapter.del(function(entry) {
        resolve(entry)
      }, key)
    })
  }

  return store
}
