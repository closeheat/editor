var $, Header, Navigation, Promise, React, RouteHandler, Router, _, flatten, jade, request;

React = require('react/addons');

jade = require('jade-memory-fs');

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

module.exports = React.createClass({
  getInitialState: function() {
    return {
      clean_files: this.serializedFiles()
    };
  },
  mixins: [Navigation],
  editorChange: function(path, new_content) {
    var bug_message;
    bug_message = 'If you see this - a bug occured. Could you send us a message by clicking Support in the top?';
    return fs.writeFileSync(fs.join('/', path), new_content || bug_message);
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
  serializedFiles: function() {
    var result;
    result = flatten(fs.data, {
      delimiter: '/'
    });
    result = _.omit(result, function(content, path) {
      return content === true;
    });
    return _.map(result, function(content, path) {
      return {
        path: path,
        content: content.toString()
      };
    });
  },
  transitionWithCodeModeHistory: function(route, with_history_route) {
    var editor_path;
    editor_path = this.refs.appRouteHandler.refs.__routeHandler__.props.params.splat;
    if (editor_path) {
      return this.transitionTo(with_history_route, {
        splat: editor_path
      });
    } else {
      return this.transitionTo(route);
    }
  },
  publishClick: function() {
    return this.transitionWithCodeModeHistory('publish', '/publish/*?');
  },
  changedFiles: function() {
    return _.reject(this.serializedFiles(), (function(_this) {
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
            clean_files: _this.serializedFiles()
          });
          return resolve();
        });
      };
    })(this));
  },
  render: function() {
    return React.createElement("main", null, React.createElement(Header, {
      "onCodeClick": this.codeClick,
      "onPreviewClick": this.previewClick,
      "onPublishClick": this.publishClick
    }), React.createElement(RouteHandler, {
      "browser_url": this.props.browser_url,
      "editorChange": this.editorChange,
      "onRouteChange": this.routeChange,
      "build": this.build,
      "ref": 'appRouteHandler'
    }));
  }
});
