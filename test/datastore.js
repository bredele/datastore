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
