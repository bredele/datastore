/**
 * Dependencies.
 */

var promise = require('bluff')


/**
 *
 */

module.exports = function(data, adapter) {

  data = data || {}

  var store = {}


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
   * @api public
   */

  store.set = function(key, value) {
    return promise(function(resolve, reject) {
      var set = function(key, value) {
        data[key] = typeof value == 'function' ? value.call(data) : value
        resolve(value)
      }
      if(value != null) set(key, value)
      else return function(val) {
        set(key, val)
      }
    })
  }


  /**
   * Removes any value associated to the key.
   *
   * @param {Any} key
   * @api public
   */

  store.del = function(key) {
    delete data[key]
  }

  return store
}
