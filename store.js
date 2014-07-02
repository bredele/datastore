
;(function(){

/**
 * Require the module at `name`.
 *
 * @param {String} name
 * @return {Object} exports
 * @api public
 */

function require(name) {
  var module = require.modules[name];
  if (!module) throw new Error('failed to require "' + name + '"');

  if (!('exports' in module) && typeof module.definition === 'function') {
    module.client = module.component = true;
    module.definition.call(this, module.exports = {}, module);
    delete module.definition;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Register module at `name` with callback `definition`.
 *
 * @param {String} name
 * @param {Function} definition
 * @api private
 */

require.register = function (name, definition) {
  require.modules[name] = {
    definition: definition
  };
};

/**
 * Define a module's exports immediately with `exports`.
 *
 * @param {String} name
 * @param {Generic} exports
 * @api private
 */

require.define = function (name, exports) {
  require.modules[name] = {
    exports: exports
  };
};
require.register("bredele~clone@master", function (exports, module) {

/**
 * Expose 'clone'
 * @param  {Object} obj 
 * @api public
 */

module.exports = function(obj) {
  var cp = null;
  if(obj instanceof Array) {
    cp = obj.slice(0);
  } else {
    //hasOwnProperty doesn't work with Object.create
    // cp = Object.create ? Object.create(obj) : clone(obj);
    cp = clone(obj);
  }
  return cp;
};


/**
 * Clone object.
 * @param  {Object} obj 
 * @api private
 */

function clone(obj){
  if(typeof obj === 'object') {
    var copy = {};
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        copy[key] = clone(obj[key]);
      }
    }
    return copy;
  }
  return obj;
}

});

require.register("component~emitter@1.1.2", function (exports, module) {

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

});

require.register("bredele~looping@1.1.1", function (exports, module) {

/**
 * Expose 'looping'
 */

module.exports = function(obj, fn, scope){
  scope = scope || this;
  if( obj instanceof Array) {
    array(obj, fn, scope);
  } else if(typeof obj === 'object') {
    object(obj, fn, scope);
  }
};


/**
 * Object iteration.
 * @param  {Object}   obj   
 * @param  {Function} fn    
 * @param  {Object}   scope 
 * @api private
 */

function object(obj, fn, scope) {
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      fn.call(scope, i, obj[i]);
    }
  }
}


/**
 * Array iteration.
 * @param  {Array}   obj   
 * @param  {Function} fn    
 * @param  {Object}   scope 
 * @api private
 */

function array(obj, fn, scope){
  for(var i = 0, l = obj.length; i < l; i++){
    fn.call(scope, i, obj[i]);
  }
}

});

require.register("bredele~many@0.3.3", function (exports, module) {

/**
 * Module dependencies.
 * @api private
 */

var loop = require("bredele~looping@1.1.1");


/**
 * Expose many.
 *
 * Only works when the first argument of a function
 * is a string.
 *
 * Examples:
 *
 *   var fn = many(function(name, data) {
 *     // do something
 *   });
 *   
 *   fn('bar', {});
 *   fn({
 *     'foo' : {},
 *     'beep' : {}
 *   });
 *
 * @param {Function}
 * @return {Function} 
 * @api public
 */

module.exports = function(fn) {
	var many = function(str) {
		if(typeof str === 'object') loop(str, many, this);
		else fn.apply(this, arguments);
		return this;
	};
	return many;
};

});

require.register("datastore", function (exports, module) {

/**
 * Module dependencies.
 * @api private
 */

var Emitter = require("component~emitter@1.1.2");
var clone = require("bredele~clone@master");
var each = require("bredele~looping@1.1.1");
var many = require("bredele~many@0.3.3");
try {
  var storage = window.localStorage;
} catch(_) {
  var storage = null;
}


/**
 * Expose 'Store'
 */

module.exports = Store;


/**
 * Store constructor.
 *
 * @param {Object} data
 * @api public
 */

function Store(data) {
  if(data instanceof Store) return data;
  this.data = data || {};
  this.formatters = {};
}


Emitter(Store.prototype);


/**
 * Set store attribute.
 * 
 * Examples:
 *
 *   //set
 *   .set('name', 'bredele');
 *   //update
 *   .set({
 *     name: 'bredele'
 *   });
 *   
 * @param {String} name
 * @param {Everything} value
 * @api public
 */

Store.prototype.set = many(function(name, value, strict) {
  var prev = this.data[name];
  if(prev !== value) {
    this.data[name] = value;
    if(!strict) this.emit('updated', name, value);
    this.emit('change', name, value, prev);
    this.emit('change ' + name, value, prev);
  }
});


/**
 * Get store attribute.
 * 
 * @param {String} name
 * @return {this}
 * @api public
 */

Store.prototype.get = function(name) {
  var formatter = this.formatters[name];
  var value = this.data[name];
  if(formatter) {
    value = formatter[0].call(formatter[1], value);
  }
  return value;
};

/**
 * Get store attribute.
 * 
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

Store.prototype.has = function(name) {
  return this.data.hasOwnProperty(name);
};


/**
 * Delete store attribute.
 * 
 * @param {String} name
 * @return {this}
 * @api public
 */

Store.prototype.del = function(name, strict) {
  //TODO:refactor this is ugly
  if(this.has(name)){
    if(this.data instanceof Array){
      this.data.splice(name, 1);
    } else {
      delete this.data[name]; //NOTE: do we need to return something?
    }
    if(!strict) this.emit('updated', name);
    this.emit('deleted', name, name);
    this.emit('deleted ' + name, name);
  }
  return this;
};


/**
 * Set format middleware.
 * 
 * Call formatter everytime a getter is called.
 * A formatter should always return a value.
 * 
 * Examples:
 *
 *   .format('name', function(val) {
 *     return val.toUpperCase();
 *   });
 *   
 * @param {String} name
 * @param {Function} callback
 * @param {Object} scope
 * @return {this}
 * @api public
 */

Store.prototype.format = function(name, callback, scope) {
  this.formatters[name] = [callback,scope];
  return this;
};


/**
 * Compute store attributes.
 * 
 * Examples:
 *
 *   .compute('name', function() {
 *     return this.firstName + ' ' + this.lastName;
 *   });
 *   
 * @param  {String} name
 * @param {Function} callback
 * @return {this}                
 * @api public
 */

Store.prototype.compute = function(name, callback) {
  //NOTE: I want something clean instaead passing the computed 
  //attribute in the function
  var str = callback.toString();
  var attrs = str.match(/this.[a-zA-Z0-9]*/g);

  this.set(name, callback.call(this.data)); //TODO: refactor (may be use replace)
  for(var l = attrs.length; l--;){
    this.on('change ' + attrs[l].slice(5), function(){
      this.set(name, callback.call(this.data));
    });
  }
  return this;
};


/**
 * Reset store
 * 
 * @param  {Object} data 
 * @return {this} 
 * @api public
 */

Store.prototype.reset = function(data, strict) {
  var copy = clone(this.data),
    length = data.length;
    this.data = data;

  each(copy, function(key, val){
    if(typeof data[key] === 'undefined'){
      if(!strict) this.emit('updated', key);
      this.emit('deleted', key, length);
      this.emit('deleted ' + key, length);
    }
  }, this);

  //set new attributes
  each(data, function(key, val){
    //TODO:refactor with this.set
    var prev = copy[key];
    if(prev !== val) {
      if(!strict) this.emit('updated', key, val);
      this.emit('change', key, val, prev);
      this.emit('change ' + key, val, prev);
    }
  }, this);
  return this;
};


/**
 * Loop through store data.
 * 
 * @param  {Function} cb   
 * @param  {[type]}   scope 
 * @return {this} 
 * @api public
 */

Store.prototype.loop = function(cb, scope) {
  each(this.data, cb, scope || this);
  return this;
};


/**
 * Pipe two stores (merge and listen data).
 * example:
 *
 *   .pipe(store);
 *   
 * note: pipe only stores of same type
 *
 * @param {Store} store 
 * @return {this} 
 * @api public
 */

Store.prototype.pipe = function(store) {
  store.set(this.data);
  this.on('updated', function(name, val) {
    if(val) return store.set(name, val);
    store.del(name);
  });
  return this;
};

/**
 * Synchronize with local storage.
 * 
 * @param  {String} name 
 * @param  {Boolean} bool save in localstore
 * @return {this} 
 * @api public
 */

Store.prototype.local = function(name, bool) {
  //TODO: should we do a clear for .local()?
  if(!bool) {
    storage.setItem(name, this.toJSON());
  } else {
    this.reset(JSON.parse(storage.getItem(name)));
  }
  return this;
};


/**
 * Use middlewares to extend store.
 * 
 * A middleware is a function with the store
 * as first argument.
 *
 * Examples:
 *
 *   store.use(plugin, 'something');
 * 
 * @param  {Function} fn 
 * @return {this}
 * @api public
 */

Store.prototype.use = function(fn) {
  var args = [].slice.call(arguments, 1);
  fn.apply(this, [this].concat(args));
  return this;
};


/**
 * Stringify model
 * @return {String} json
 * @api public
 */

Store.prototype.toJSON = function(replacer, space) {
  return JSON.stringify(this.data, replacer, space);
};

});

if (typeof exports == "object") {
  module.exports = require("datastore");
} else if (typeof define == "function" && define.amd) {
  define([], function(){ return require("datastore"); });
} else {
  this["store"] = require("datastore");
}
})()
