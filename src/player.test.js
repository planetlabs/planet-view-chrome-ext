var MockStorage = require('dom-storage');
var lab = exports.lab = require('lab').script();
var expect = require('code').expect;

var Player = require('./player');
var util = require('./util');

lab.experiment('Player', function() {

  lab.beforeEach(util.addGlobals);

  lab.afterEach(util.removeGlobals);

  lab.test('constructor', function(done) {
    var player = new Player();
    expect(player).to.be.an.instanceof(Player);

    expect(global.addEventListener.calledOnce).to.be.true();
    var call = global.addEventListener.getCall(0);
    expect(call.args[0]).to.equal('popstate');

    expect(player.store.get('views')).to.deep.equal({});
    done();
  });

  lab.test('#_syncStore()', function(done) {
    var player = new Player();

    player.entries = {
      one: true,
      two: true,
      three: true
    };

    player._syncStore();
    expect(player.store.get('views')).to.deep.equal({
      one: 0,
      two: 0,
      three: 0
    });

    done();
  });

  lab.test('#_syncStore() - new entry', function(done) {
    var player = new Player();

    player.store.set('views', {
      one: 1,
      two: 1,
      three: 1
    });

    player.entries = {
      one: true,
      two: true,
      three: true,
      four: true
    };

    player._syncStore();
    expect(player.store.get('views')).to.deep.equal({
      one: 1,
      two: 1,
      three: 1,
      four: 0
    });

    done();
  });

  lab.test('#_syncStore() - new entry, many previous views', function(done) {
    var player = new Player();

    player.store.set('views', {
      one: 10,
      two: 11,
      three: 11
    });

    player.entries = {
      one: true,
      two: true,
      three: true,
      four: true
    };

    player._syncStore();
    expect(player.store.get('views')).to.deep.equal({
      one: 10,
      two: 11,
      three: 11,
      four: 9
    });

    done();
  });

});
