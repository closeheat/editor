var $, App, Core, Editor, Filesystem, React, reponame, token, username;

$ = require('jquery');

React = require('react');

Filesystem = require('./filesystem');

Editor = require('./editor');

App = require('./app');

module.exports = Core = (function() {
  function Core(token, username, reponame) {
    this.filesystem = new Filesystem(token, username, reponame);
  }

  Core.prototype.load = function() {
    return this.filesystem.load().then(function() {
      return React.render(React.createElement(App, null), document.body);
    });
  };

  return Core;

})();

token = 'd188e3d18211aaec848e0a4f9066fc8d56a161f8';

username = 'Nedomas';

reponame = 'testing-editor';

$(function() {
  return new Core(token, username, reponame).load();
});
