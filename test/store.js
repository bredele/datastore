var Store = require('store');
var assert = require('assert');

// describe('store initialization', function(){
//   it('should expose a constructor', function(){
//   });

//   it('should extend an existing object', function(){
//   });
// });

describe('General', function(){

  it('should initialize a store with an object', function(){
    var other = new Store({
      name : 'olivier'
    });
    assert('olivier' === other.get('name'));
  });

  describe('setter/getter', function(){
    var store = null;

    beforeEach(function(){
      store = new Store();
    });

    it('should set the data', function(){
      store.set('name', 'olivier');
      assert('olivier' === store.get('name'));
    });

    it('should update an existing store attribute', function(){
      store.set('name', 'olivier');
      store.set('name', 'bredele');
      assert('bredele' === store.get('name'));
    });

    it("should return undefined if attribute doesn't exist", function(){
      assert(undefined === store.get('name'));
    });

    describe('setter emitter', function(){
      var store = null;
      beforeEach(function(){
        store = new Store();
      });

      it('should emit a change event when set attribute', function(){
        var obj = {};
        store.on('change', function(name, value){
          obj[name] = value;
        });
        store.set('name', 'olivier');
        assert(obj.name === 'olivier');
      });

      it('should only emit event whwn attribute has changed', function(){
        var hasChanged = false;
        store.set('name', 'olivier');
        store.on('change', function(name, value){
          hasChanged = true;
        });
        store.set('name', 'olivier');
        assert(false === hasChanged);
      });

      it('should emit a change event with the current and previous value of an attribute', function(){
        var obj = {};
        store.set('name', 'olivier');
        store.on('change', function(name, value, prev){
          obj[name] = [value, prev];
        });
        store.set('name', 'bredele');
        assert(obj.name[0] === 'bredele');
        assert(obj.name[1] === 'olivier');    
      });

    });
  });

  describe('delete', function(){
    var store = null;

    beforeEach(function(){
      store = new Store();
    });

    it('should delete a model attribute', function(){
      store.set('name', 'olivier');
      store.del('name');
      assert(undefined === store.get('name'));
    });

    it("should not delete a model attribute that doesn't exist", function(){
      store.del('name');
      assert(undefined === store.get('name'));
    });

    describe('delete emitter', function(){ //NOTE: is that necessary?
      it('should emit a deleted event when delete an attribute', function(){
        var store = new Store();
        var isDeleted = false;
        var deletedAttr = '';
        store.set('name', 'olivier');
        store.on('deleted', function(name){
          isDeleted = true;
          deletedAttr = name;
        });
        store.del('name');
        assert(isDeleted === true);
        assert(deletedAttr === 'name');
      });

      it("should not emit the deleted event if attribute doesn't exist", function(){
        var store = new Store();
        var isDeleted = false;
        var deletedAttr = '';
        store.on('deleted', function(name){
          isDeleted = true;
          deletedAttr = name;
        });
        store.del('name');
        assert(isDeleted === false);
        assert(deletedAttr === '');
      });
    });

  });

  describe('reset', function(){
    var store = null;
    beforeEach(function(){
      store = new Store({
        name: 'olivier',
        twitter: 'bredeleca'
      });
    });

    it('should reset store', function(){
      store.reset({
        github:'bredele'
      });
      assert(undefined === store.get('name'));
      assert(undefined === store.get('twitter'));
      assert('bredele' === store.get('github'));
    });

    it('should notify on change', function(){
      var isDeleted = false;
      store.on('deleted name', function(){
        isDeleted = true;
      }); //TODO: may be spy 
      store.reset({
        github:'bredele'
      });

      assert(true === isDeleted);
    });

  });

});

describe('formatter', function(){
  //NOTE: could we have formatter as plugin in the set function
  it('should return the formatted data', function(){
    var store = new Store();
    store.format('name', function(value){
      return value.toUpperCase();
    });
    store.set('name', 'olivier');
    assert('OLIVIER' === store.get('name'));
  });
});

describe('computed attributes', function(){
  var store = null;
  beforeEach(function(){
    store = new Store();
    store.set('firstname', 'olivier');
    store.set('lastname', 'wietrich');
  });
  it('should compute multiple attributes', function(){
    store.compute('name', function(){
      return this.firstname + ' ' + this.lastname;
    });
    assert('olivier wietrich' === store.get('name'));
  });

  it('should listen change on a computed attribute', function(){
    var obj = {};
    store.compute('name', function(){
      return this.firstname + ' ' + this.lastname;
    });

    store.on('change name', function(value){
      obj.hasChanged = true;
      obj.value = value;
    });

    store.set('firstname', 'nicolas');

    assert('nicolas wietrich' === store.get('name'));
  });
});

describe('utils', function(){
  it('to json', function(){
    var store = new Store({
      name : 'olivier',
      github: 'bredele'
    });
    store.set('twitter', 'bredeleca');
    var json = store.toJSON();
    assert( '{"name":"olivier","github":"bredele","twitter":"bredeleca"}' === json);
  });
});

// describe('array like', function(){
//   it('should set the data', function(){
//   });
// });
