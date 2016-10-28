/**
 * Tests dependencies.
 */

var test = require('tape')
var store = require('..')
var promise = require('bluff')


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

test('should emit specific changed event when store entry is set', assert => {
  assert.plan(1)
  var data = store()
  data.on('changed label', (value) => {
    assert.equal(value, 'hello')
  })
  data.set('label', 'hello')
})


test('should emit global changed event when store entry is set', assert => {
  assert.plan(2)
  var data = store()
  data.on('changed', (key, value) => {
    assert.equal(key, 'label')
    assert.equal(value, 'hello')
  })
  data.set('label', 'hello')
})


test('should emit changed event when set with previous value', assert => {
  assert.plan(2)
  var data = store({
    label: 'world'
  })
  data.on('changed label', (value, previous) => {
    assert.equal(previous, 'world')
    assert.equal(value, 'hello')
  })
  data.set('label', 'hello')
})


test('should set store entry and return a promise', assert => {
  assert.plan(1)
  var data = store()
  data.set('label', 'hello').then(function() {
    assert.equal(data.get('label'), 'hello')
  })
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

  data.set('welcome', function() {
    return this.label + ' world!'
  })
  assert.equal(data.get('welcome'), 'hello world!')
})

// test('should set a promise', assert => {
//   assert.plan(2)
//   var data = store()
//   var later = data.set('label', promise(function(resolve) {
//     setTimeout(function() {
//       resolve('hello')
//     }, 500)
//   }))
//
//   assert.equal(data.get('label'), undefined)
//   later.then(function() {
//     assert.equal(data.get('label'), 'hello')
//   })
// })


test('should delete a store entry', assert => {
  assert.plan(1)
  var data = store({
    label: 'hello'
  })
  data.del('label')
  assert.equal(data.get('label'), undefined)
})


test('should delete store entry and return a promise', assert => {
  assert.plan(1)
  var data = store({
    label: 'hello'
  })
  data.del('label').then(function() {
    assert.equal(data.get('label'), undefined)
  })
})

test('should emit specific deleted event when store entry is deleted', assert => {
  assert.plan(1)
  var data = store({
    label: 'hello'
  })
  data.on('deleted label', (value) => {
    assert.equal(value, 'hello')
  })
  data.del('label')
})

test('should emit global deleted event when store entry is deleted', assert => {
  assert.plan(2)
  var data = store({
    label: 'hello'
  })
  data.on('deleted', (key, value) => {
    assert.equal(key, 'label')
    assert.equal(value, 'hello')
  })
  data.del('label')
})


test('should pull/get a store entry', assert => {
  assert.plan(1)
  var data = store({
    label: 'hello'
  })

  data.pull('label').then(function(value) {
    assert.equal(value, 'hello')
  })
})


test('should contain a store entry', assert => {
  assert.plan(1)
  var data = store({
    label: 'hello'
  })
  assert.equal(data.contains('label'), true)
})


test('should have a store entry', assert => {
  assert.plan(1)
  var data = store({
    label: 'hello'
  })

  data.has('label').then(function(bool) {
    assert.equal(bool, true)
  })
})
