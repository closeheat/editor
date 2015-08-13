var $, Header, Navigation, React, RouteHandler, Router, _, jade;

React = require('react/addons');

jade = require('jade-memory-fs');

_ = require('lodash');

$ = window.jQuery = window.$ = require('jquery');

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
    var browser_ref;
    this.transitionWithCodeModeHistory('preview', 'preview-with-history');
    browser_ref = this.refs.appRouteHandler.refs.__routeHandler__.refs.browser;
    if (!browser_ref) {
      return;
    }
    return browser_ref.refresh();
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
