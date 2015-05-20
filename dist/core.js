var $, App, Core, Filesystem, React, base, reponame, server, token, username;

$ = require('jquery');

React = require('react');

Filesystem = require('./filesystem');

App = require('./app');

module.exports = Core = (function() {
  function Core(token, username, reponame, base1, server1) {
    this.base = base1;
    this.server = server1;
    this.filesystem = new Filesystem(token, username, reponame);
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

token = '6dd48ba02321d681d139bd9247066cbee6898019';

username = 'Nedomas';

reponame = 'testing-editor';

base = 'http://testing-editor.closeheatapp.com/';

username = 'closeheat';

reponame = 'web';

base = 'http://web.closeheatapp.com/';

server = 'http://localhost:3000';

$(function() {
  return new Core(token, username, reponame, base, server).load();
});
