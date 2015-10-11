var $, App, CodeMode, Core, ErrorHandler, InitialLoader, InlineMode, PreviewMode, Publish, React, Redirect, Route, Router, Settings, TabManager, md;

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

InlineMode = require('./inline_mode');

Settings = require('./settings');

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
            "slug": _this.data.slug,
            "avatar": _this.data.avatar,
            "browser_url": _this.data.browser_url,
            "dist_dir": _this.data.dist_dir,
            "is_demo_app": _this.data.is_demo_app,
            "first_build": _this.data.first_build
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
      "name": 'inline',
      "path": '/inline',
      "handler": InlineMode
    }), React.createElement(Route, {
      "name": 'inline-with-history',
      "path": '/inline/*?',
      "handler": InlineMode
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
    }), React.createElement(Route, {
      "name": 'settings',
      "path": '/settings',
      "handler": Settings
    }), React.createElement(Route, {
      "name": 'settings-with-history',
      "path": '/settings/*?',
      "handler": Settings
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
