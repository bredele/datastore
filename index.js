/**
 * Dependencies.
 */

var promise = require('bluff')
var memory = require('./lib/memory')
var Emitter = require('emitter-component')


/**
 *
 */

module.exports = function(data, adapter) {

  data = data || {}

  var store = new Emitter()

  var proxy = memory.call(store, data)


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
   * Get value associated to a key (asynchronous version)
   *
   * @param {Any} key
   * @return value associated to the key, or undefined if there is none
   * @api public
   */

  store.pull = function(key) {
    return promise(function(resolve) {
      proxy.pull(function(key) {
        resolve(key)
      }, key)
    })
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
    var prev = data[key]
    var cb = function(val) {
      return promise(function(resolve) {
          proxy.set(function(key, entry) {
            resolve(entry)
            store.emit('changed ' + key, value, prev)
            store.emit('changed', key, value, prev)
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
    var prev = data[key]
    return promise(function(resolve) {
      proxy.del(function(entry) {
        resolve(entry)
        store.emit('deleted ' + key, prev)
        store.emit('deleted', key, prev)
      }, key)
    })
  }

  return store
}
