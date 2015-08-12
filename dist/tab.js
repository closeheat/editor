var Link, React, Router;

React = require('react/addons');

Router = require('react-router');

Link = Router.Link;

module.exports = React.createClass({
  render: function() {
    return React.createElement("li", null, React.createElement(Link, {
      "to": 'file',
      "params": {
        path: this.props.path
      }
    }, React.createElement("div", null, this.props.path)));
  }
});
