var Emitter = require('emitter'); //TODO:replace by our own with scope
var each = require('each');//TODO:replace by our own with scope

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
 * @param {String} name
 * @param {Everything} value
 * @api public
 */

Store.prototype.set = function(name, value, plugin) { //add object options
  var prev = this.data[name];
  if(prev !== value) {
    this.data[name] = value;
    this.emit('change', name, value, prev);
    this.emit('change ' + name, value, prev);
  }
};


/**
 * Get store attribute.
 * @param {String} name
 * @return {Everything}
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
 * @param {String} name
 * @return {Everything}
 * @api private
 */

Store.prototype.has = function(name) {
  //NOTE: I don't know if it should be public
  return this.data.hasOwnProperty(name);
};


/**
 * Delete store attribute.
 * @param {String} name
 * @return {Everything}
 * @api public
 */

Store.prototype.del = function(name) {
  if(this.has(name)){
    delete this.data[name]; //NOTE: do we need to return something?
    this.emit('deleted', name);
    this.emit('deleted ' + name);
  }
};


/**
 * Set format middleware.
 * Call formatter everytime a getter is called.
 * A formatter should always return a value.
 * @param {String} name
 * @param {Function} callback
 * @param {Object} scope
 * @return this
 * @api public
 */

Store.prototype.format = function(name, callback, scope) {
  this.formatters[name] = [callback,scope];
  return this;
};


/**
 * Compute store attributes
 * @param  {[type]} first_argument 
 * @return {[type]}                
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
};


/**
 * Reset store
 * @param  {Object} data 
 * @api public
 */

Store.prototype.reset = function(data) {
  //remove undefined attributes
  each(this.data, function(key, val){
    if(typeof data[key] === 'undefined'){ //data[key] can be 0
      this.del(key);
    }
  }, this);
  //set new attributes
  each(data, function(key, val){
    this.set(key, val);
  }, this);
};


/**
 * Stringify model
 * @return {String} json
 * @api public
 */

Store.prototype.toJSON = function() {
  return JSON.stringify(this.data);
};