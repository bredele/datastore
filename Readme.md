# datastore

> Data structures are central to programming. If you've chosen the right data structures and organized things well, the code will almost always be self-evident.

[![Build Status](https://travis-ci.org/bredele/datastore.png?branch=master)](https://travis-ci.org/bredele/store)

  Datastore is an observable data layer for both client and server side with a pluggable interface to synchronize your data in real time, access local/cookie/session storage, redis database and way more.
  
  
<!-- 
  Datastore component is a single wrapper for your models and collections.

  > Some front end framework provide collections which are basically ordered sets of models (or arrays of objects) with no extra features. Datastore removes this overhead and helps you focus on your data instead of maintaining something useless.


  Datastore contains your data and all the logic surrounding it such as formatters, access control, computed properties, reset, local storage and can be easily extended with its [middleware engine](https://github.com/bredele/datastore#usefn).
-->

## Usage

### Basic

  Store is an observable layer on top of your data.
<!-- add emitter doc -->
```js
var store = new Store();
store.set('name', 'olivier');
store.get('name');
// => olivier

store.on('change github', function(val) {
  console.log('woohoo');
});

store.compute('github', function() {
  return 'http://github.com/' + this.name;
});

store.set('name', 'bredele');
// => woohoo
store.get('github');
// => http://github.com/bredele
```

<a href="http://requirebin.com/?gist=9b7761a10d61609018ff" target="_blank"><img src="https://runnable.com/external/styles/assets/runnablebtn.png" style="width:67px;height:25px;"></a>


### Plugins

Store is composable and can be extended with plugins.

```js
function plugin(store) {
  // do something on store
}
store.use(plugin);
```

Here's a list of available plugins:

  - [mirror](http://github.com/bredele/store-mirror)  real time sync with a datastore in server side.
  - [local store](http://github.com/bredele/store-local) local storage layer
  - [path](http://github.com/bredele/store-path) access nested properties of a store
  - [supplant](http://github.com/bredele/store-supplant) template engine on both client/server side
  - [queue](http://github.com/bredele/emitter-queue) queue store events
  - [toggle](http://github.com/bredele/store-toggle) enable/disable store property
  <!--- [redis](http://github.com/bredele/emitter-redis) redis store layer-->


## Installation

component:

    $ component install bredele/datastore

nodejs:

    $ npm install datastore

bower(berk!):

    $ bower install datastore-js

## Browser Support

Datastore supports all mainstream browsers from IE8+.
Supports IE7 with JSON polyfill.


## API

### store(data)

  Create a new store with the given `data` (Object or Array).

```js
var Store = require('datastore');
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
  name : 'amy'
});
```

  Emits `change` event with `name, value, previous value`.<br>
  Emits `change name` event with `value, previous value`.

 Or update a store with an object of same type:

object store:
```js
store.set({
  nickname: 'olivier',
  lastname: 'wietrich'
});
```

array store:
```js
//update 0
store.set([{
  name: 'olivier',
  github: 'bredele'
}]);
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

### .del(name)

 Delete a store attribute.

```js
store.del('nickname');
```

  Emits `deleted` event with `name`.<br>
  Emits `deleted name` event.


### .on(name, fn)

  Listen events on Store.

```js
store.on('change', function(name, val, previous) {
  ...
});
```

### .loop(fn)

  Loop over the store data (use **[looping](http://github.com/bredele/looping)** underneath).

```js
store.loop(function(key, value) {
  // do something
});
```

### .compute(name, fn)

 Compute store properties into a new property.

```js
store.compute('id', function(){
  return this.nickname + this.firstname;
});
```

 Compute listen for changes on the computed properties and update automatically
 the new property.


### .format(name, fn)

  Format an attribute output in Store.

```js
store.format('nickname', function(val) {
  return 'hello ' + val;
});

store.get('nickname'); //hello bredele
```

### .pipe(store)

  Pipe two stores.

```js
//update child with store
store.pipe(child);

store.set('name', 'olivier');
child.get('name'); //olivier
```
 Listen for changes and update both stores.

### .reset(data)

  Reset store with `data` (Object or Array).

```js
store.reset([]);
```

  Emits `change` and/or `deleted` events. 
  
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

See wiki for some [examples](https://github.com/bredele/datastore/wiki/Plugins).


## License

The MIT License (MIT)

Copyright (c) 2014 Olivier Wietrich <olivier.wietrich@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
