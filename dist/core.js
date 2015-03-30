var $, App, Core, Editor, Filesystem, React, base, reponame, token, username;

$ = require('jquery');

React = require('react');

Filesystem = require('./filesystem');

Editor = require('./editor');

App = require('./app');

module.exports = Core = (function() {
  function Core(token, username, reponame, base1) {
    this.base = base1;
    this.filesystem = new Filesystem(token, username, reponame);
  }

  Core.prototype.load = function() {
    return this.filesystem.load().then((function(_this) {
      return function() {
        return React.render(React.createElement(App, {
          base: _this.base
        }), document.body);
      };
    })(this));
  };

  return Core;

})();

token = '8080149d057ce69f7b78ae2a7ade804bc4b79d65';

username = 'closeheat';

reponame = 'web';

base = 'http://web.closeheatapp.com/';

$(function() {
  return new Core(token, username, reponame, base).load();
});
