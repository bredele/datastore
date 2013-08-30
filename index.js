var Emitter = require('emitter'); //replace by our own

/**
 * Expose 'Store'
 */

module.exports = Store;


/**
 * Store constructor
 * @api public
 */

function Store(data) {
  this.data = data || {};
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
  this.data[name] = value;
  this.emit('change', name, value, prev);
};


/**
 * Get store attribute.
 * @param {String} name
 * @return {Everything}
 * @api public
 */

Store.prototype.get = function(name) {
  return this.data[name];
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
  }
};


/**
 * Set format middleware.
 * Call formatter everytime a getter is called.
 * @param {String} name
 * @param {Function} callback
 * @param {Object} scope
 * @return this
 * @api public
 */

Store.prototype.format = function(name, callback, scope) {
  return this;
};


/**
 * Compute store attributes
 * @param  {[type]} first_argument [description]
 * @return {[type]}                [description]
 * @api public
 */

Store.prototype.compute = function() {
  // body...
};