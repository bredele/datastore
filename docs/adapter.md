# Adapter

An adapter is used to define custom behavior for fundamental operations (e.g. property lookup, assignment, enumeration, function invocation, etc). Similar to the concept of [proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), an adapter is a function that return an object whose properties are functions which define the behavior of the proxy when an operation is performed on it.

Here's a simple example:

```js
var store = datastore({}, adapter)

store.set('name', 'olivier')
store.get('name') // => hello olivier

function adapter(data) {
  return {
    set: function(target, key, value) {
      target(key, 'hello ' + value)
    }
  }
}
```

The methods `set`, `pull`, `has` and `del` of the datastore can be overridden by the adapter. The `target` is a fallback to the regular behavior of a datastore (in-memory storage) and has to be called to resolve the promises returned by these methods.
