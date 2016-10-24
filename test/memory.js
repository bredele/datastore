/**
 * Tests dependencies.
 */

var test = require('tape')
var store = require('..')


test('should initialize data', assert => {
  assert.plan(1)
  var data = store({
    label: 'hello'
  })

  assert.equal(data.get('label'), 'hello')
})


test('should set store entry', assert => {
  assert.plan(1)
  var data = store()
  data.set('label', 'hello')
  assert.equal(data.get('label'), 'hello')
})


test('should curry setter', assert => {
  assert.plan(1)
  var data = store()
  var label = data.set('label')
  label('hello')
  assert.equal(data.get('label'), 'hello')
})


test('should compute a store entry', assert => {
  assert.plan(1)
  var data = store({
    label: 'hello'
  })

  // shorthand this is not store
  data.set('welcome', function() {
    return this.label + ' world!'
  })
  assert.equal(data.get('welcome'), 'hello world!')
})
