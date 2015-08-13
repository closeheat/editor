var Link, React, Router;

React = require('react/addons');

Router = require('react-router');

Link = Router.Link;

module.exports = React.createClass({
  activeClass: function() {
    if (this.props.active) {
      return 'active';
    }
  },
  render: function() {
    return React.createElement("li", {
      "className": this.activeClass()
    }, React.createElement(Link, {
      "to": 'file',
      "params": {
        splat: this.props.href
      }
    }, this.props.path));
  }
});
