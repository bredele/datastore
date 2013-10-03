# store

  store component (inspired by olives.js)

## Installation

    $ component install leafs/store

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

## License

  MIT
