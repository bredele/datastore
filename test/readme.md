# API

To run the tests, please type the command:

```shell
npm test
```

The [unit tests](/test) will give you a better appreciation of the following API.

## store(data, adapter)

  Create and initialize a store with an optional `data` object and/or optional adapter.

```js
var store = datastore()

// in memory datastore
var store = datastore({
  name: 'olivier'
})

// datastore with redis database fallback/adapter
var store = datastore({
  name: 'olivier'
}, redis())
```

By default, data will be stored in memory. Adapters are to synchronize the data with other sources of storage.
See the [adapter](/docs/adapter.md) documentation for more information.

## .set(key, value)

 Set a store `key` with `value` (value can be anything, even [a promise](/examples)).

```js
store.set('nickname', 'bredele')
```

Because setting a value in a database can be asynchronous, the method `set` returns a promise that represents the result of this operation.

```js
store
  .set('nickname', 'bredele')
  .then(function() {
    // do something when nickname has been successfully set
  })
```

A datastore is also an event emitter and will emit the following events once a pair key/value has been set:

  Emits `changed` event with `key, value, previous value`.<br>
  Emits `changed key` event with `value, previous value`.


## .get(key)

 Get an attribute `key`.

```js
store.get('name');
```

The method `get` is synchronous and returns the value of a key in memory. For its asynchronous equivalent, please refer to [pull](#pull)

## .pull(key)

 Get an attribute `key`.

```js
store.pull('name')
store.pull('nickname').then(function(value) {
  // do something with value
})
```

## .del(key)

 Delete a store key.

```js
store.del('name')
store.del('nickname').then(function() {
  // nickname has successfully been deleted
})
```

  Emits `deleted` event with `key`.<br>
  Emits `deleted key` event.