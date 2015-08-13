var $, Header, Navigation, Promise, React, RouteHandler, Router, _, jade, request;

React = require('react/addons');

jade = require('jade-memory-fs');

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
      code_editor_path: ''
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
    return this.build().then((function(_this) {
      return function(resp) {
        var browser_ref;
        _this.transitionWithCodeModeHistory('preview', 'preview-with-history');
        browser_ref = _this.refs.appRouteHandler.refs.__routeHandler__.refs.browser;
        if (!browser_ref) {
          return;
        }
        return browser_ref.refresh();
      };
    })(this))["catch"](function(err) {
      return console.log(err);
    });
  },
  build: function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return request.post({
          json: true,
          url: window.location.origin + "/apps/" + APP_SLUG + "/live_edit/preview"
        }, function(err, status, resp) {
          if (err) {
            return reject(err);
          }
          if (!resp.success) {
            return reject(resp.error);
          }
          return resolve(resp.files);
        });
      };
    })(this));
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
  publishClick: function() {},
  render: function() {
    return React.createElement("main", null, React.createElement(Header, {
      "onCodeClick": this.codeClick,
      "onPreviewClick": this.previewClick,
      "onPublishClick": this.publishClick
    }), React.createElement(RouteHandler, {
      "base": this.props.base,
      "editorChange": this.editorChange,
      "onRouteChange": this.routeChange,
      "ref": 'appRouteHandler'
    }));
  }
});
