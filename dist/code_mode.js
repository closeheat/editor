var Link, React, RouteHandler, Router, Tabs;

React = require('react/addons');

Router = require('react-router');

RouteHandler = Router.RouteHandler;

Link = Router.Link;

Tabs = require('./tabs');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      tabs: [
        {
          path: 'index.jade',
          content: 'h2 Nope'
        }, {
          path: 'js/app.coffee',
          content: 'var hello;'
        }
      ]
    };
  },
  render: function() {
    return React.createElement("div", null, React.createElement("div", {
      "className": 'row'
    }, React.createElement("div", {
      "className": 'col editor-col full m12'
    }, React.createElement("div", {
      "className": 'editor'
    }, React.createElement("ul", null, React.createElement(Tabs, {
      "full_path": this.props.params.splat
    })), React.createElement(RouteHandler, React.__spread({}, this.props))))));
  }
});
