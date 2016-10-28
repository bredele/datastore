/**
 * Dependencies.
 */

var memory = require('./memory')


/**
 * Delegate datastore methods to a proxy object (adapter)
 *
 * All methods (set, pull, del, etc) have a fallback in memory.
 *
 * @param {Object} store
 * @param {Object} data
 * @param {Function} adapter
 * @return {Function}
 * @api private
 */

module.exports = function(store, data, adapter) {
  var fallback = memory.call(store, data)
  adapter = adapter ? adapter.call(store, data) : {}
  return function(method, cb, key, value) {
    (adapter[method] || function(target, key, value) {
      target(key, value)
    })(function(key, value) {
      fallback[method](cb, key, value)
    }, key, value)
  }
}
