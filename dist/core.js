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

token = 'a991e9e427f251e019f662562830b54c4836d7ea';

username = 'Nedomas';

reponame = 'testing-editor';

$(function() {
  return new Core(token, username, reponame).load();
});
