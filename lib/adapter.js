/**
 * Dependencies.
 */

var memory = require('./memory')


/**
 *
 *
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
