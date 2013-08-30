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

Emitter(Store);

/**
 * Set store attribute.
 * @param {String} name
 * @param {Everything} value
 * @api public
 */

Store.prototype.set = function(name, value, plugin) { //add object options
  this.data[name] = value;
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