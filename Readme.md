# store

  Store component (inspired by olives.js)

## Installation

    $ component install bredele/store

## API

### store(data)

  Create a new store with the given `data` (Object or Array).

```js
var Store = require('store');
var users = new Store([{
  name : 'eric'
},{
  name : 'olivier'
}]);
```

### .set(name, data)

 Set an attribute `name` with data object.

object store:
```js
store.set('nickname','bredele');
```

array store:
```js
store.set(0,{
  name : 'mark'
});
```

### .get(name)

 Get an attribute `name`.

object store:
```js
store.get('nickname');
```

array store:
```js
store.get(0);
```

### .compute(name, fn)

 Compute store properties into a new property. Compute is smart enough
 to know which properties to compute.

```js
store.compute('name', function(){
  return nickname + firstname;
});
```


### .reset(data)

  Reset store with `data` (Object or Array).

```js
store.reset([]);
```

  

## License

  MIT
