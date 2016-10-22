

/**
 *
 */

module.exports = function(data) {
  var store = {}

  store.get = function(key) {
    return data[key]
  }
  
  return store
}
