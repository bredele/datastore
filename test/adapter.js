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
        }, 100)
      }
    }
  })

  data.set('label', 'hello').then(function() {
    assert.equal(data.get('label'), 'hello world')
  })
})

test('shoud pull data with adapter', assert => {
  assert.plan(1)
  var data = store({
    label: 'hello'
  }, function(data) {
    return {
      pull(target, key) {
        setTimeout(() => {
          target(key)
        }, 100)
      }
    }
  })

  data.pull('label').then(function(value) {
    assert.equal(value, 'hello')
  })
})


test('shoud delete data with adapter', assert => {
  assert.plan(1)
  var data = store({
    label: 'hello'
  }, function(data) {
    return {
      del(target, key) {
        setTimeout(() => {
          target(key)
        }, 100)
      }
    }
  })

  data.del('label').then(function() {
    assert.equal(data.get('label'), undefined)
  })
})
