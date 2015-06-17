var $, App, Core, Filesystem, React, md;

md = require('marked');

$ = require('jquery');

React = require('react');

Filesystem = require('./filesystem');

App = require('./app');

module.exports = Core = (function() {
  function Core(base, server) {
    this.base = base;
    this.server = server;
    this.filesystem = new Filesystem();
  }

  Core.prototype.load = function() {
    return this.filesystem.load().then((function(_this) {
      return function() {
        return React.render(React.createElement(App, {
          base: _this.base,
          server: _this.server
        }), document.body);
      };
    })(this));
  };

  return Core;

})();

$(function() {
  return new Core(APP_DOMAIN).load();
});
