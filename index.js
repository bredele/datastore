/**
 * Dependencies.
 */

var promise = require('bluff')
var delegate = require('./lib/adapter')
var emitter = require('emitter-component')


/**
 * Expose `datastore`
 */

module.exports = datastore


/**
 * Create a datastore.
 *
 * @param {Object?} data
 * @param {Function?} adapter
 * @api public
 */

function datastore(data, adapter) {
  return datastore.factory({}, data, adapter)
}


/**
 * Mixin an object with a datastore.
 *
 * @api private
 */

datastore.factory = function(obj, data, adapter) {

  data = data || {}

  /**
   * A datastore is an event emitter.
   */

  var store = emitter(obj)


  /**
   * Delegate operations to the datastore adapter.
   * (Fallback in memory)
   */

  var proxy = delegate(store, data, adapter)


  /**
   * Returns the value associated to the key, or undefined if there is none.
   * (synchronous version)
   *
   * @param {Any} key
   * @return value associated to the key, or undefined if there is none
   * @api public
   */

  store.get = function(key) {
    return data[key]
  }


  /**
   * Returns the value associated to the key, or undefined if there is none.
   * (asynchronous version)
   *
   * @param {Any} key
   * @return value associated to the key, or undefined if there is none
   * @return {Promise}
   * @api public
   */

  store.pull = function(key) {
    return promise(function(resolve) {
      proxy('pull', resolve, key)
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
        proxy('set', function(key, entry) {
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
   * @param {Any} key\
   * @return {Promise}
   * @api public
   */

  store.del = function(key) {
    var prev = data[key]
    return promise(function(resolve) {
      proxy('del', function(entry) {
        resolve(entry)
        store.emit('deleted ' + key, prev)
        store.emit('deleted', key, prev)
      }, key)
    })
  }

  /**
   * Returns a boolean asserting whether a value has been associated
   * to the key in the datastore or not.
   *
   * @param {String} key
   * @return {Boolean}
   * @return {Promise}
   * @api public
   */

  store.contains = function(key) {
    return data.hasOwnProperty(key)
  }


  /**
   * Returns a promise asserting whether a value has been associated
   * to the key in the datastore or not.
   *
   * @param {String} key
   * @return {Boolean}
   * @api public
   */

  store.has = function(key) {
    return promise(function(resolve) {
      proxy('has', resolve, key)
    })
  }

  return store
}
