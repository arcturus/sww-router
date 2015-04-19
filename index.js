'use strict';

// Inspired by expressjs and shed (https://github.com/wibblymat/shed)
function Router(options) {
  this.options = options;
  this.stack = [];
}

Router.prototype.ALL_METHODS = 'all';
Router.prototype.methods = ['get', 'post', 'put', 'delete', 'head',
  Router.prototype.ALL_METHODS];

/**
 * Add a new route to the stack.
 * @param method (String) http verb to handle the request
 * @param path (Regexp) string or regexp to match urls
 * @param handler (Function) payload to be executed if url matches.
 */
Router.prototype.add = function r_add(method, path, handler) {
  method = method.toLowerCase();
  if (this.methods.indexOf(method) === -1) {
    throw new Error('Method %s is not supported', method);
  }
  this.stack.push({
    method: method,
    path: new RegExp(path),
    handler: handler
  });
};

/**
 * Create the utility methods .get .post ... etc.
 */
Router.prototype.methods.forEach(function(method) {
  Router.prototype[method] = function(path, handler) {
    return this.add(method, path, handler);
  };
});

/**
 * Proxy the router methods to the given object. Used to give the
 * inmediate layer the same syntax than the router uses.
 * @param obj (Object) object to proxify the Router methods
 */
Router.prototype.proxyMethods = function r_proxyPrototype(obj) {
  var self = this;
  this.methods.forEach(function(method) {
    obj[method] = function(path, mw) {
      if (!(typeof mw.onFetch !== 'function' || typeof mw !== 'function')) {
        throw new Error('This middleware cannot handle fetch request');
      }
      var handler = typeof mw.onFetch !== 'undefined' ?
        mw.onFetch.bind(mw) : mw;
      self.add(method, path, handler);
    };
  });
};

/**
 * Matches the given url and methods with the routes stored in
 * the stack.
 * @param method (string) http verb
 * @param url (string) url requested
 * @returns (Array) array of middleware that matches method and url
 */
Router.prototype.match = function r_match(method, url) {
  method = method.toLowerCase();
  var matches = [];

  var self = this;
  this.stack.forEach(function eachRoute(route) {
    if (!(method === route.method || route.method === self.ALL_METHODS)) {
      return;
    }

    if (route.path.test(url)) {
      matches.push(route.handler);
    }
  });

  return matches;
};

module.exports = Router;
