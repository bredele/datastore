

module.exports = function(data) {
  return {
    set: function(target, key, value) {
      data[key] = typeof value == 'function' ? value.call(data) : value
      target(key, value)
    },

    del: function(target, key) {
      delete data[key]
      target(key)
    }
  }
}
