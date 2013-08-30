var Store = require('store');
var assert = require('assert');

// describe('store initialization', function(){
//   it('should expose a constructor', function(){
//   });

//   it('should extend an existing object', function(){
//   });
// });

describe('object like', function(){
  var store = null;

  beforeEach(function(){
    store = new Store();
  });

  it('should set the data', function(){
    store.set('name', 'olivier');
    assert('olivier' === store.get('name'));
  });

  it('should override an existing store attribute', function(){
    store.set('name', 'olivier');
    store.set('name', 'bredele');
    assert('bredele' === store.get('name'));
  });

  it("should return undefined if attribute doesn't exist", function(){
    assert(undefined === store.get('name'));
  });

  it('should initialize a store with an object', function(){
    var other = new Store({
      name : 'olivier'
    });
    assert('olivier' === other.get('name'));
  });
});

describe('store emitter', function(){
  var store = null;
  beforeEach(function(){
    store = new Store();
  });

  it('should emit a change event when set attribute', function(){
    
  });

});

// describe('array like', function(){
//   it('should set the data', function(){
//   });
// });
