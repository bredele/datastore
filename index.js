var storage = null,
		Emitter,
		clone,
		each;
try {
  storage = window.localStorage;
  Emitter = require('emitter');
  clone = require('clone');
  each = require('each');
} catch(_) {
	Emitter = require('emitter-component');
	clone = require('clone-bredele');
  each = require('each-bredele');
}


/**
 * Expose 'Store'
 */

module.exports = Store;


/**
 * Store constructor
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
 * example:
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

Store.prototype.set = function(name, value, strict) { //add object options
	var prev = this.data[name];
	//TODO: what happend if update store-object with an array and vice versa?
	if(typeof name === 'object') return each(name, this.set, this);
	if(prev !== value) {
		this.data[name] = value;
		if(!strict) this.emit('updated', name, value);
		this.emit('change', name, value, prev);
		this.emit('change ' + name, value, prev);
	}
	return this;
};


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
 * @api private
 */

Store.prototype.has = function(name) {
	//NOTE: I don't know if it should be public
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
 * Call formatter everytime a getter is called.
 * A formatter should always return a value.
 * example:
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
 * Compute store attributes
 * example:
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
 * A middleware is a function with the store
 * as first argument.
 * 
 * @param  {Function} fn 
 * @return {this}
 * @api public
 */

Store.prototype.use = function(fn) {
	fn(this);
	return this;
};


/**
 * Stringify model
 * @return {String} json
 * @api public
 */

Store.prototype.toJSON = function() {
	return JSON.stringify(this.data);
};

//TODO: localstorage middleware like
