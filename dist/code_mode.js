var React, RouteHandler, Router, Tab, _;

React = require('react/addons');

_ = require('lodash');

Router = require('react-router');

RouteHandler = Router.RouteHandler;

Tab = require('./tab');

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
    }, React.createElement("ul", null, _.map(this.state.tabs, function(tab) {
      return React.createElement(Tab, React.__spread({}, tab));
    })), React.createElement(RouteHandler, React.__spread({}, this.props))))));
  }
});
