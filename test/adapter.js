/**
 * Tests dependencies.
 */

var test = require('tape')
var store = require('..')


test('should set data with adapter', assert => {
  assert.plan(1)
  var data = store({}, function(data) {
    return {
      set(target, key, value) {
        setTimeout(() => {
          target(key, value + ' world')
        }, 500)
      }
    }
  })

  data.set('label', 'hello').then(function() {
    assert.equal(data.get('label'), 'hello world')
  })
})
