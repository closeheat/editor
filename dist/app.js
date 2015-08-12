var App, React, RouteHandler, Router;

React = require('react/addons');

require('./materialize');

Router = require('react-router');

RouteHandler = Router.RouteHandler;

module.exports = App = React.createClass({
  render: function() {
    return React.createElement("main", null, React.createElement(RouteHandler, null));
  }
});
