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
    this.bindKeys();
    return {
      clean_files: _.cloneDeep(Filesystem.ls()),
      action_in_progress: false
    };
  },
  bindKeys: function() {
    return $(window).bind('keydown', (function(_this) {
      return function(event) {
        if (!(event.ctrlKey || event.metaKey)) {
          return;
        }
        switch (String.fromCharCode(event.which).toLowerCase()) {
          case 's':
            event.preventDefault();
            return _this.previewClick();
          case 'e':
            event.preventDefault();
            return _this.codeClick();
        }
      };
    })(this));
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
    if (this.state.action_in_progress) {
      return;
    }
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
    if (this.state.action_in_progress) {
      return;
    }
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
    this.actionStarted();
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
          _this.actionStopped();
          return resolve();
        });
      };
    })(this));
  },
  filesChanged: function() {
    return !_.isEmpty(this.changedFiles());
  },
  publish: function() {
    if (this.filesChanged()) {
      return this.build().then(this.publish)["catch"]((function(_this) {
        return function(err) {
          return _this.handleError(err);
        };
      })(this));
    } else {
      this.actionStarted();
      return this.execPublish().then((function(_this) {
        return function(resp) {
          if (!resp.success) {
            return _this.handleError(resp.error);
          }
          return _this.actionStopped();
        };
      })(this))["catch"]((function(_this) {
        return function(err) {
          return _this.handleError(err);
        };
      })(this));
    }
  },
  execPublish: function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return request.post({
          json: true,
          url: window.location.origin + "/apps/" + APP_SLUG + "/live_edit/publish"
        }, function(err, status, resp) {
          if (err) {
            return reject(err);
          }
          return resolve(resp);
        });
      };
    })(this));
  },
  activeMode: function() {
    var routes;
    routes = this.context.router.getCurrentRoutes();
    return _.first(routes[1].name.split('-'));
  },
  actionStarted: function() {
    return this.setState({
      action_in_progress: true
    });
  },
  actionStopped: function() {
    return this.setState({
      action_in_progress: false
    });
  },
  render: function() {
    return React.createElement("main", {
      "className": 'editor-wrapper'
    }, React.createElement(Header, {
      "action_in_progress": this.state.action_in_progress,
      "website_url": this.props.website_url,
      "active_mode": this.activeMode(),
      "onCodeClick": this.codeClick,
      "onPreviewClick": this.previewClick,
      "onPublishClick": this.publishClick,
      "avatar": this.props.avatar
    }), React.createElement(RouteHandler, {
      "browser_url": this.props.browser_url,
      "website_url": this.props.website_url,
      "editorChange": this.editorChange,
      "build": this.build,
      "handleError": this.handleError,
      "error": this.state.error,
      "transitionWithCodeModeHistory": this.transitionWithCodeModeHistory,
      "files_changed": this.filesChanged(),
      "publish": this.publish,
      "actionStopped": this.actionStopped,
      "ref": 'appRouteHandler'
    }));
  }
});
