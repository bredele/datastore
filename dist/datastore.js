(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.datastore = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Dependencies.
 */

var promise = require('bluff')
var delegate = require('./lib/adapter')
var Emitter = require('emitter-component')


/**
 * Expose `datastore`
 *
 * @param {Object?} data
 * @param {Function?} adapter
 * @api public
 */

module.exports = function(data, adapter) {

  data = data || {}

  /**
   * A datastore is an event emitter.
   */

  var store = new Emitter()


  /**
   * Delegate operations to the datastore adapter.
   * (Fallback in memory)
   */

  var proxy = delegate(store, data, adapter)


  /**
   * Get value associated to a key (synchronous version)
   *
   * @param {Any} key
   * @return value associated to the key, or undefined if there is none
   * @api public
   */

  store.get = function(key) {
    return data[key]
  }


  /**
   * Get value associated to a key (asynchronous version)
   *
   * @param {Any} key
   * @return value associated to the key, or undefined if there is none
   * @api public
   */

  store.pull = function(key) {
    return promise(function(resolve) {
      proxy('pull', resolve, key)
    })
  }


  /**
   * Sets the value for the key in the datastore.
   *
   * @param {Any} key
   * @param {Any} value
   * @return {Promise}
   * @api public
   */

  store.set = function(key, value) {
    var prev = data[key]
    var cb = function(val) {
      return promise(function(resolve) {
        proxy('set', function(key, entry) {
          resolve(entry)
          store.emit('changed ' + key, value, prev)
          store.emit('changed', key, value, prev)
        }, key, val)
      })
    }
    return value == null ? cb : cb(value)
  }


  /**
   * Removes any value associated to the key.
   *
   * @param {Any} key
   * @api public
   */

  store.del = function(key) {
    var prev = data[key]
    return promise(function(resolve) {
      proxy('del', function(entry) {
        resolve(entry)
        store.emit('deleted ' + key, prev)
        store.emit('deleted', key, prev)
      }, key)
    })
  }

  return store
}

},{"./lib/adapter":2,"bluff":4,"emitter-component":5}],2:[function(require,module,exports){
/**
 * Dependencies.
 */

var memory = require('./memory')


/**
 * Delegate datastore methods to a proxy object (adapter)
 *
 * All methods (set, pull, del, etc) have a fallback in memory.
 *
 * @param {Object} store
 * @param {Object} data
 * @param {Function} adapter
 * @return {Function}
 * @api private
 */

module.exports = function(store, data, adapter) {
  var fallback = memory.call(store, data)
  adapter = adapter ? adapter.call(store, data) : {}
  return function(method, cb, key, value) {
    (adapter[method] || function(target, key, value) {
      target(key, value)
    })(function(key, value) {
      fallback[method](cb, key, value)
    }, key, value)
  }
}

},{"./memory":3}],3:[function(require,module,exports){

/**
 * In memory adapter.
 *
 * A datastore always save its keys into memory.
 *
 * @param {Object} data
 * @return {Object} proxy
 * @api private
 */

module.exports = function(data) {
  return {
    set: function(target, key, value) {
      data[key] = typeof value == 'function' ? value.call(data) : value
      target(key, value)
    },

    del: function(target, key) {
      delete data[key]
      target(key)
    },

    pull: function(target, key) {
      target(data[key])
    }
  }
}

},{}],4:[function(require,module,exports){

/**
 * Promise A+ implementation.
 *
 * @param {Function} resolver
 * @return thenable
 * @api public
 */

module.exports = function promise(resolver) {
  var state = 'pending'
  var result
  var fulfilled = []
  var rejected = []
  resolver(function(value) {
    state = 'fulfilled'
    result = value
    fulfilled.map(function(cb) {
      cb(result)
    })
  }, function(reason) {
    state = 'rejected'
    result = reason
    rejected.map(function(cb) {
      cb(result)
    })
  })
  return {
    then: function(fulfill, reject) {
      if(typeof fulfill != 'function') fulfill = function(value) {
        return value
      }
      if(typeof reject != 'function') reject = function(reason) {
        return reason
      }
      return promise(function(success, error) {
        if(state == 'pending') {
          fulfilled.push(function(value) {
            try {
              success(fulfill(value))
            } catch(e) {
              error(e)
            }
          })
          rejected.push(function(reason) {
            try {
              error(reject(reason))
            } catch(e) {
              error(e)
            }
          })
        } else if(state == 'fulfilled') success(fulfill(result))
        else error(reject(result))
      })
    }
  }
}

},{}],5:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsImxpYi9hZGFwdGVyLmpzIiwibGliL21lbW9yeS5qcyIsIm5vZGVfbW9kdWxlcy9ibHVmZi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9lbWl0dGVyLWNvbXBvbmVudC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIERlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgcHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWZmJylcbnZhciBkZWxlZ2F0ZSA9IHJlcXVpcmUoJy4vbGliL2FkYXB0ZXInKVxudmFyIEVtaXR0ZXIgPSByZXF1aXJlKCdlbWl0dGVyLWNvbXBvbmVudCcpXG5cblxuLyoqXG4gKiBFeHBvc2UgYGRhdGFzdG9yZWBcbiAqXG4gKiBAcGFyYW0ge09iamVjdD99IGRhdGFcbiAqIEBwYXJhbSB7RnVuY3Rpb24/fSBhZGFwdGVyXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGF0YSwgYWRhcHRlcikge1xuXG4gIGRhdGEgPSBkYXRhIHx8IHt9XG5cbiAgLyoqXG4gICAqIEEgZGF0YXN0b3JlIGlzIGFuIGV2ZW50IGVtaXR0ZXIuXG4gICAqL1xuXG4gIHZhciBzdG9yZSA9IG5ldyBFbWl0dGVyKClcblxuXG4gIC8qKlxuICAgKiBEZWxlZ2F0ZSBvcGVyYXRpb25zIHRvIHRoZSBkYXRhc3RvcmUgYWRhcHRlci5cbiAgICogKEZhbGxiYWNrIGluIG1lbW9yeSlcbiAgICovXG5cbiAgdmFyIHByb3h5ID0gZGVsZWdhdGUoc3RvcmUsIGRhdGEsIGFkYXB0ZXIpXG5cblxuICAvKipcbiAgICogR2V0IHZhbHVlIGFzc29jaWF0ZWQgdG8gYSBrZXkgKHN5bmNocm9ub3VzIHZlcnNpb24pXG4gICAqXG4gICAqIEBwYXJhbSB7QW55fSBrZXlcbiAgICogQHJldHVybiB2YWx1ZSBhc3NvY2lhdGVkIHRvIHRoZSBrZXksIG9yIHVuZGVmaW5lZCBpZiB0aGVyZSBpcyBub25lXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIHN0b3JlLmdldCA9IGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBkYXRhW2tleV1cbiAgfVxuXG5cbiAgLyoqXG4gICAqIEdldCB2YWx1ZSBhc3NvY2lhdGVkIHRvIGEga2V5IChhc3luY2hyb25vdXMgdmVyc2lvbilcbiAgICpcbiAgICogQHBhcmFtIHtBbnl9IGtleVxuICAgKiBAcmV0dXJuIHZhbHVlIGFzc29jaWF0ZWQgdG8gdGhlIGtleSwgb3IgdW5kZWZpbmVkIGlmIHRoZXJlIGlzIG5vbmVcbiAgICogQGFwaSBwdWJsaWNcbiAgICovXG5cbiAgc3RvcmUucHVsbCA9IGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBwcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgIHByb3h5KCdwdWxsJywgcmVzb2x2ZSwga2V5KVxuICAgIH0pXG4gIH1cblxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2YWx1ZSBmb3IgdGhlIGtleSBpbiB0aGUgZGF0YXN0b3JlLlxuICAgKlxuICAgKiBAcGFyYW0ge0FueX0ga2V5XG4gICAqIEBwYXJhbSB7QW55fSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBzdG9yZS5zZXQgPSBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgdmFyIHByZXYgPSBkYXRhW2tleV1cbiAgICB2YXIgY2IgPSBmdW5jdGlvbih2YWwpIHtcbiAgICAgIHJldHVybiBwcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgICAgcHJveHkoJ3NldCcsIGZ1bmN0aW9uKGtleSwgZW50cnkpIHtcbiAgICAgICAgICByZXNvbHZlKGVudHJ5KVxuICAgICAgICAgIHN0b3JlLmVtaXQoJ2NoYW5nZWQgJyArIGtleSwgdmFsdWUsIHByZXYpXG4gICAgICAgICAgc3RvcmUuZW1pdCgnY2hhbmdlZCcsIGtleSwgdmFsdWUsIHByZXYpXG4gICAgICAgIH0sIGtleSwgdmFsKVxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlID09IG51bGwgPyBjYiA6IGNiKHZhbHVlKVxuICB9XG5cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbnkgdmFsdWUgYXNzb2NpYXRlZCB0byB0aGUga2V5LlxuICAgKlxuICAgKiBAcGFyYW0ge0FueX0ga2V5XG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuXG4gIHN0b3JlLmRlbCA9IGZ1bmN0aW9uKGtleSkge1xuICAgIHZhciBwcmV2ID0gZGF0YVtrZXldXG4gICAgcmV0dXJuIHByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgcHJveHkoJ2RlbCcsIGZ1bmN0aW9uKGVudHJ5KSB7XG4gICAgICAgIHJlc29sdmUoZW50cnkpXG4gICAgICAgIHN0b3JlLmVtaXQoJ2RlbGV0ZWQgJyArIGtleSwgcHJldilcbiAgICAgICAgc3RvcmUuZW1pdCgnZGVsZXRlZCcsIGtleSwgcHJldilcbiAgICAgIH0sIGtleSlcbiAgICB9KVxuICB9XG5cbiAgcmV0dXJuIHN0b3JlXG59XG4iLCIvKipcbiAqIERlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgbWVtb3J5ID0gcmVxdWlyZSgnLi9tZW1vcnknKVxuXG5cbi8qKlxuICogRGVsZWdhdGUgZGF0YXN0b3JlIG1ldGhvZHMgdG8gYSBwcm94eSBvYmplY3QgKGFkYXB0ZXIpXG4gKlxuICogQWxsIG1ldGhvZHMgKHNldCwgcHVsbCwgZGVsLCBldGMpIGhhdmUgYSBmYWxsYmFjayBpbiBtZW1vcnkuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHN0b3JlXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICogQHBhcmFtIHtGdW5jdGlvbn0gYWRhcHRlclxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHN0b3JlLCBkYXRhLCBhZGFwdGVyKSB7XG4gIHZhciBmYWxsYmFjayA9IG1lbW9yeS5jYWxsKHN0b3JlLCBkYXRhKVxuICBhZGFwdGVyID0gYWRhcHRlciA/IGFkYXB0ZXIuY2FsbChzdG9yZSwgZGF0YSkgOiB7fVxuICByZXR1cm4gZnVuY3Rpb24obWV0aG9kLCBjYiwga2V5LCB2YWx1ZSkge1xuICAgIChhZGFwdGVyW21ldGhvZF0gfHwgZnVuY3Rpb24odGFyZ2V0LCBrZXksIHZhbHVlKSB7XG4gICAgICB0YXJnZXQoa2V5LCB2YWx1ZSlcbiAgICB9KShmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICBmYWxsYmFja1ttZXRob2RdKGNiLCBrZXksIHZhbHVlKVxuICAgIH0sIGtleSwgdmFsdWUpXG4gIH1cbn1cbiIsIlxuLyoqXG4gKiBJbiBtZW1vcnkgYWRhcHRlci5cbiAqXG4gKiBBIGRhdGFzdG9yZSBhbHdheXMgc2F2ZSBpdHMga2V5cyBpbnRvIG1lbW9yeS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICogQHJldHVybiB7T2JqZWN0fSBwcm94eVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkYXRhKSB7XG4gIHJldHVybiB7XG4gICAgc2V0OiBmdW5jdGlvbih0YXJnZXQsIGtleSwgdmFsdWUpIHtcbiAgICAgIGRhdGFba2V5XSA9IHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nID8gdmFsdWUuY2FsbChkYXRhKSA6IHZhbHVlXG4gICAgICB0YXJnZXQoa2V5LCB2YWx1ZSlcbiAgICB9LFxuXG4gICAgZGVsOiBmdW5jdGlvbih0YXJnZXQsIGtleSkge1xuICAgICAgZGVsZXRlIGRhdGFba2V5XVxuICAgICAgdGFyZ2V0KGtleSlcbiAgICB9LFxuXG4gICAgcHVsbDogZnVuY3Rpb24odGFyZ2V0LCBrZXkpIHtcbiAgICAgIHRhcmdldChkYXRhW2tleV0pXG4gICAgfVxuICB9XG59XG4iLCJcbi8qKlxuICogUHJvbWlzZSBBKyBpbXBsZW1lbnRhdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXNvbHZlclxuICogQHJldHVybiB0aGVuYWJsZVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHByb21pc2UocmVzb2x2ZXIpIHtcbiAgdmFyIHN0YXRlID0gJ3BlbmRpbmcnXG4gIHZhciByZXN1bHRcbiAgdmFyIGZ1bGZpbGxlZCA9IFtdXG4gIHZhciByZWplY3RlZCA9IFtdXG4gIHJlc29sdmVyKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgc3RhdGUgPSAnZnVsZmlsbGVkJ1xuICAgIHJlc3VsdCA9IHZhbHVlXG4gICAgZnVsZmlsbGVkLm1hcChmdW5jdGlvbihjYikge1xuICAgICAgY2IocmVzdWx0KVxuICAgIH0pXG4gIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgIHN0YXRlID0gJ3JlamVjdGVkJ1xuICAgIHJlc3VsdCA9IHJlYXNvblxuICAgIHJlamVjdGVkLm1hcChmdW5jdGlvbihjYikge1xuICAgICAgY2IocmVzdWx0KVxuICAgIH0pXG4gIH0pXG4gIHJldHVybiB7XG4gICAgdGhlbjogZnVuY3Rpb24oZnVsZmlsbCwgcmVqZWN0KSB7XG4gICAgICBpZih0eXBlb2YgZnVsZmlsbCAhPSAnZnVuY3Rpb24nKSBmdWxmaWxsID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgICB9XG4gICAgICBpZih0eXBlb2YgcmVqZWN0ICE9ICdmdW5jdGlvbicpIHJlamVjdCA9IGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgICByZXR1cm4gcmVhc29uXG4gICAgICB9XG4gICAgICByZXR1cm4gcHJvbWlzZShmdW5jdGlvbihzdWNjZXNzLCBlcnJvcikge1xuICAgICAgICBpZihzdGF0ZSA9PSAncGVuZGluZycpIHtcbiAgICAgICAgICBmdWxmaWxsZWQucHVzaChmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgc3VjY2VzcyhmdWxmaWxsKHZhbHVlKSlcbiAgICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgICBlcnJvcihlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgcmVqZWN0ZWQucHVzaChmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGVycm9yKHJlamVjdChyZWFzb24pKVxuICAgICAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICAgIGVycm9yKGUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIGlmKHN0YXRlID09ICdmdWxmaWxsZWQnKSBzdWNjZXNzKGZ1bGZpbGwocmVzdWx0KSlcbiAgICAgICAgZWxzZSBlcnJvcihyZWplY3QocmVzdWx0KSlcbiAgICAgIH0pXG4gICAgfVxuICB9XG59XG4iLCJcbi8qKlxuICogRXhwb3NlIGBFbWl0dGVyYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVtaXR0ZXI7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgRW1pdHRlcmAuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBFbWl0dGVyKG9iaikge1xuICBpZiAob2JqKSByZXR1cm4gbWl4aW4ob2JqKTtcbn07XG5cbi8qKlxuICogTWl4aW4gdGhlIGVtaXR0ZXIgcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBtaXhpbihvYmopIHtcbiAgZm9yICh2YXIga2V5IGluIEVtaXR0ZXIucHJvdG90eXBlKSB7XG4gICAgb2JqW2tleV0gPSBFbWl0dGVyLnByb3RvdHlwZVtrZXldO1xuICB9XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogTGlzdGVuIG9uIHRoZSBnaXZlbiBgZXZlbnRgIHdpdGggYGZuYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbiA9XG5FbWl0dGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICAodGhpcy5fY2FsbGJhY2tzW2V2ZW50XSA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF0gfHwgW10pXG4gICAgLnB1c2goZm4pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWRkcyBhbiBgZXZlbnRgIGxpc3RlbmVyIHRoYXQgd2lsbCBiZSBpbnZva2VkIGEgc2luZ2xlXG4gKiB0aW1lIHRoZW4gYXV0b21hdGljYWxseSByZW1vdmVkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcblxuICBmdW5jdGlvbiBvbigpIHtcbiAgICBzZWxmLm9mZihldmVudCwgb24pO1xuICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBvbi5mbiA9IGZuO1xuICB0aGlzLm9uKGV2ZW50LCBvbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGdpdmVuIGNhbGxiYWNrIGZvciBgZXZlbnRgIG9yIGFsbFxuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub2ZmID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gIC8vIGFsbFxuICBpZiAoMCA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBzcGVjaWZpYyBldmVudFxuICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcbiAgaWYgKCFjYWxsYmFja3MpIHJldHVybiB0aGlzO1xuXG4gIC8vIHJlbW92ZSBhbGwgaGFuZGxlcnNcbiAgaWYgKDEgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gcmVtb3ZlIHNwZWNpZmljIGhhbmRsZXJcbiAgdmFyIGNiO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgIGNiID0gY2FsbGJhY2tzW2ldO1xuICAgIGlmIChjYiA9PT0gZm4gfHwgY2IuZm4gPT09IGZuKSB7XG4gICAgICBjYWxsYmFja3Muc3BsaWNlKGksIDEpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBFbWl0IGBldmVudGAgd2l0aCB0aGUgZ2l2ZW4gYXJncy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7TWl4ZWR9IC4uLlxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgLCBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuXG4gIGlmIChjYWxsYmFja3MpIHtcbiAgICBjYWxsYmFja3MgPSBjYWxsYmFja3Muc2xpY2UoMCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgY2FsbGJhY2tzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYXJyYXkgb2YgY2FsbGJhY2tzIGZvciBgZXZlbnRgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICByZXR1cm4gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhpcyBlbWl0dGVyIGhhcyBgZXZlbnRgIGhhbmRsZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUuaGFzTGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICByZXR1cm4gISEgdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmxlbmd0aDtcbn07XG4iXX0=
