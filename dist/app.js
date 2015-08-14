var $, Filesystem, Header, Navigation, Promise, React, RouteHandler, Router, _, flatten, request;

React = require('react/addons');

flatten = require('flat');

_ = require('lodash');

$ = window.jQuery = window.$ = require('jquery');

request = require('request');

Promise = require('bluebird');

require('./materialize');

Router = require('react-router');

RouteHandler = Router.RouteHandler;

Navigation = Router.Navigation;

Header = require('./header');

Filesystem = require('./filesystem');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      clean_files: _.cloneDeep(Filesystem.ls())
    };
  },
  mixins: [Navigation],
  editorChange: function(path, new_content) {
    return Filesystem.write(path, new_content);
  },
  codeClick: function() {
    return this.transitionWithCodeModeHistory('code', '/code/*?');
  },
  previewClick: function() {
    var browser_ref;
    this.transitionWithCodeModeHistory('preview', 'preview-with-history');
    browser_ref = this.refs.appRouteHandler.refs.__routeHandler__.refs.browser;
    if (!browser_ref) {
      return;
    }
    return browser_ref.refresh();
  },
  transitionWithCodeModeHistory: function(route, with_history_route) {
    if (_.isEmpty(this.context.router.getCurrentParams())) {
      return this.transitionTo(route);
    } else {
      return this.transitionTo(with_history_route, this.context.router.getCurrentParams());
    }
  },
  publishClick: function() {
    return this.transitionWithCodeModeHistory('publish', '/publish/*?');
  },
  handleError: function(msg) {
    this.setState({
      error: msg
    });
    return this.transitionWithCodeModeHistory('error', '/error/*?');
  },
  changedFiles: function() {
    return _.reject(Filesystem.ls(), (function(_this) {
      return function(new_file) {
        var clean_file;
        clean_file = _.detect(_this.state.clean_files, function(file) {
          return file.path === new_file.path;
        });
        return clean_file.content === new_file.content;
      };
    })(this));
  },
  build: function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return request.post({
          json: true,
          body: {
            files: _this.changedFiles()
          },
          url: window.location.origin + "/apps/" + APP_SLUG + "/live_edit/preview"
        }, function(err, status, resp) {
          if (err) {
            return reject(err);
          }
          if (!resp.success) {
            return reject(resp.error);
          }
          _this.setState({
            clean_files: _.cloneDeep(Filesystem.ls())
          });
          return resolve();
        });
      };
    })(this));
  },
  activeMode: function() {
    var routes;
    routes = this.context.router.getCurrentRoutes();
    return _.first(routes[1].name.split('-'));
  },
  render: function() {
    return React.createElement("main", {
      "className": 'editor-wrapper'
    }, React.createElement(Header, {
      "website_url": this.props.website_url,
      "active_mode": this.activeMode(),
      "onCodeClick": this.codeClick,
      "onPreviewClick": this.previewClick,
      "onPublishClick": this.publishClick
    }), React.createElement(RouteHandler, {
      "browser_url": this.props.browser_url,
      "website_url": this.props.website_url,
      "editorChange": this.editorChange,
      "build": this.build,
      "files_changed": !_.isEmpty(this.changedFiles()),
      "handleError": this.handleError,
      "error": this.state.error,
      "transitionWithCodeModeHistory": this.transitionWithCodeModeHistory,
      "ref": 'appRouteHandler'
    }));
  }
});
