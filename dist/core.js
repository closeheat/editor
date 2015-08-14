var $, App, CodeMode, Core, DefaultRoute, InitialLoader, PreviewMode, Publish, React, Route, Router, TabManager, md;

md = require('marked');

$ = require('jquery');

React = require('react');

Router = require('react-router');

Route = Router.Route;

DefaultRoute = Router.DefaultRoute;

InitialLoader = require('./initial_loader');

App = require('./app');

CodeMode = require('./code_mode');

PreviewMode = require('./preview_mode');

TabManager = require('./tab_manager');

Publish = require('./publish');

module.exports = Core = (function() {
  function Core(base, server) {
    this.base = base;
    this.server = server;
    this.initial_loader = new InitialLoader();
  }

  Core.prototype.load = function() {
    return this.initial_loader.loadFilesAndData().then((function(_this) {
      return function(data) {
        _this.data = data;
        return Router.run(_this.routes(), function(Handler) {
          return React.render(React.createElement(Handler, {
            "browser_url": _this.data.browser_url
          }), document.body);
        });
      };
    })(this));
  };

  Core.prototype.routes = function() {
    return React.createElement(Route, {
      "handler": App,
      "path": '/'
    }, React.createElement(Route, {
      "name": 'code',
      "path": '/code',
      "handler": CodeMode
    }, React.createElement(Route, {
      "name": 'file',
      "path": '*?',
      "handler": TabManager
    }), React.createElement(DefaultRoute, {
      "name": 'file-manager',
      "handler": TabManager
    })), React.createElement(Route, {
      "name": 'preview',
      "path": '/preview',
      "handler": PreviewMode
    }), React.createElement(Route, {
      "name": 'preview-with-history',
      "path": '/preview/*?',
      "handler": PreviewMode
    }), React.createElement(Route, {
      "name": 'publish',
      "path": '/publish',
      "handler": Publish
    }), React.createElement(Route, {
      "name": 'publish-with-history',
      "path": '/publish/*?',
      "handler": Publish
    }), React.createElement(DefaultRoute, {
      "handler": CodeMode
    }));
  };

  return Core;

})();

$(function() {
  return new Core(APP_DOMAIN).load();
});
