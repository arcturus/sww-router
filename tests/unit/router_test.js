/* global suite, setup, test, teardown */
var chai = require('chai');
var sinon = require('sinon');
var Router = require('../../index.js');

suite('Router tests', function() {
  var subject;

  setup(function() {
    subject = new Router();
  });

  suite('Proxy', function() {
    setup(function() {
      sinon.spy(subject, 'add');
    });

    teardown(function() {
      sinon.restore(subject);
    });

    test('> methods exists in proxy object', function() {
      var test = {};
      subject.proxyMethods(test);
      subject.methods.forEach(function(method) {
        chai.assert.isNotNull(test[method]);
      });
    });

    test('> proxying http verbs', function() {
      subject.methods.forEach(function(method) {
        chai.assert.isNotNull(subject[method]);
      });
    });

    test('> handling a middleware', function() {
      var mw = {
        onFetch: function onFetch() {
          return 'for testing purposes';
        }
      };
      var test = {};

      subject.proxyMethods(test);
      test.get('/', mw);

      sinon.assert.calledOnce(subject.add);
      sinon.restore(subject);

      chai.assert.lengthOf(subject.stack, 1);
      var match = subject.stack[0];
      chai.assert.equal(match.method, 'get');
      chai.assert.equal(match.handler(), mw.onFetch());
    });

  });

  suite('Route matching', function() {
    var genericHandler = function() {};
    var postHandler = function() {};

    setup(function() {
      subject.all('/', genericHandler);
      subject.post('/post', postHandler);
    });

    test('exact matching', function() {
      var res = subject.match('get', '/');
      chai.assert.isNotNull(res);
      chai.assert.lengthOf(res, 1);
      var match = res[0];
      chai.assert.equal(match, genericHandler);
    });

    test('simple matching', function() {
      subject.get('/anything/.*', genericHandler);
      var res = subject.match('get', '/anything/resource.html');
      chai.assert.isNotNull(res);
      chai.assert.lengthOf(res, 1);
      var match = res[0];
      chai.assert.equal(match, genericHandler);
    });

    test('not matching', function() {
      var res = subject.match('get', '/unknonwpath');
      chai.assert.isNotNull(res);
      chai.assert.lengthOf(res, 0);
    });

  });
});
