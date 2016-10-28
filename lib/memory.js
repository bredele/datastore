
/**
 * In memory adapter.
 *
 * A datastore always save its keys into memory.
 *
 * @param {Object} data
 * @return {Object} proxy
 * @api private
 */

module.exports = function(data) {
  return {
    set: function(target, key, value) {
      data[key] = typeof value == 'function' ? value.call(data) : value
      target(key, value)
    },

    del: function(target, key) {
      delete data[key]
      target(key)
    },

    pull: function(target, key) {
      target(data[key])
    },

    has: function(target, key) {
      target(data.hasOwnProperty(key))
    }
  }
}
