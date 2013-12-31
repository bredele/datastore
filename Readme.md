# store

  Store component is a single wrapper for your models and collections.

  > Some front end framework provide collections which are basically ordered sets of models (or arrays of objects) with no extra features. Store removes this overhead and helps you focus on your data instead of maintaining something useless.

  Store contains your data and all the logic surrounding it such as formatters, access control, computed properties, reset, local storage and can be easily extended with its [middleware engine](https://github.com/bredele/store#usefn).


## Installation

    $ component install bredele/store

standalone:

```html
<script src="store.js"></script>
```

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

  Emit `change` event. 

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

### .del(name)

 Delete a store attribute.

```js
store.del('nickname');
```

  Emit `deleted` event.

### .compute(name, fn)

 Compute store properties into a new property.

```js
store.compute('id', function(){
  return this.nickname + this.firstname;
});
```

 Compute listen for changes on the computed properties and update automatically
 the new property.


### .reset(data)

  Reset store with `data` (Object or Array).

```js
store.reset([]);
```

  Emit `change` and/or `deleted` events. 
  
### .local(name)

  Synchronize store with local storage.

```js
store.local('mystore'); //reset with localstorage
...
store.local('mystore', true); //save in localstorage
```

### .use(fn)

  Use middleware to extend store.

```js
store.use(function(obj) {
  obj.save = function() {
    //send to server
  };
});
...
store.save();
```

## License

  MIT
