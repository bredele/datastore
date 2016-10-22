/**
 * Tests dependencies.
 */

var test = require('tape')
var store = require('..')


test('should initialize data', assert => {
  assert.plan(1)
  var data = store({
    name: 'olivier'
  })

  assert.equal(data.get('name'), 'olivier')
})


test('should set data', assert => {
  assert.plan(1)
  var data = store()
  data.set('name', 'olivier')
  assert.equal(data.get('name'), 'olivier')
})
