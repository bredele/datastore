
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
  var store = this
  return {
    set: function(target, key, value) {
      var prev = data[key]
      data[key] = typeof value == 'function' ? value.call(data) : value
      target(key, value)
      store.emit('changed ' + key, value, prev)
      store.emit('changed', key, value, prev)
    },

    del: function(target, key) {
      var prev = data[key]
      delete data[key]
      target(key)
      store.emit('deleted ' + key, prev)
      store.emit('deleted', key, prev)
    },

    pull: function(target, key) {
      target(data[key])
    },

    has: function(target, key) {
      target(data.hasOwnProperty(key))
    }
  }
}
