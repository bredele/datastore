
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
  var set = function(key, value) {
    if(typeof key == 'object') {
      for(var prop in key) {
        set(prop, key[prop])
      }
    } else {
      var prev = data[key]
      data[key] = typeof value == 'function' ? value.call(data) : value
      store.emit('changed ' + key, value, prev)
      store.emit('changed', key, value, prev)
    }
  }
  return {
    set: function(target, key, value) {
      set(key, value)
      target(key, value)
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
