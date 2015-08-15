var $, App, CodeMode, Core, ErrorHandler, InitialLoader, PreviewMode, Publish, React, Redirect, Route, Router, TabManager, md;

md = require('marked');

$ = require('jquery');

React = require('react');

Router = require('react-router');

Route = Router.Route;

Redirect = Router.Redirect;

InitialLoader = require('./initial_loader');

App = require('./app');

CodeMode = require('./code_mode');

PreviewMode = require('./preview_mode');

TabManager = require('./tab_manager');

Publish = require('./publish');

ErrorHandler = require('./error_handler');

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
            "website_url": _this.data.app_domain,
            "avatar": _this.data.avatar,
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
      "path": '/code/*?',
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
    }), React.createElement(Route, {
      "name": 'error',
      "path": '/error',
      "handler": ErrorHandler
    }), React.createElement(Route, {
      "name": 'error-with-history',
      "path": '/error/*?',
      "handler": ErrorHandler
    }), React.createElement(Redirect, {
      "from": '',
      "to": '/code/'
    }), React.createElement(Redirect, {
      "from": "/code",
      "to": "/code/"
    }));
  };

  return Core;

})();

$(function() {
  return new Core(APP_DOMAIN).load();
});
