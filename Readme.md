# store

[![Build Status](https://travis-ci.org/bredele/store.png?branch=master)](https://travis-ci.org/bredele/store)

  Store component is a single wrapper for your models and collections (inspired by [Olives.js](http://github.com/flams/olives)).

  > Some front end framework provide collections which are basically ordered sets of models (or arrays of objects) with no extra features. Store removes this overhead and helps you focus on your data instead of maintaining something useless.

  Store contains your data and all the logic surrounding it such as formatters, access control, computed properties, reset, local storage and can be easily extended with its [middleware engine](https://github.com/bredele/store#usefn).


## Installation

component:

    $ component install bredele/store

nodejs:

    $ npm install store-component

## Browser Support

Store supports all mainstream browsers from IE8+.
Supports IE7 with JSON polyfill.

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

See [plugins](#plugins)

## Plugins

Here's a list of availaible plugins:

  - [mirror](http://github.com/bredele/store-mirror)

to get real time updates from a store in server side.

```js
  store.use(mirror('mychannel'));
  store.set('hello', 'world');
```
  
  - [path](http://github.com/bredele/store-path)

to access nested data easily:

```js
  store.path('country.canada'); //get
  store.path('country.canada.city', 'calgary');//set
```

  - [supplant](http://github.com/bredele/store-supplant)

to create template engines on both client/server sides:

```js
  store.filter('upper', function(str) {
    return str.toUpperCase();
  });
  store.supplant('my name is {{name} | upper}');
```

  - [queue](http://github.com/bredele/emitter-queue)

to queue events.

```js
  store.queue('hello', 'world');
  store.on('hello', function(val) {
    //world
  });
```

## License

The MIT License (MIT)

Copyright (c) 2014 Olivier Wietrich <olivier.wietrich@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
