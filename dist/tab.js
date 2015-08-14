var Link, React, Router;

React = require('react/addons');

Router = require('react-router');

Link = Router.Link;

module.exports = React.createClass({
  activeClass: function() {
    var result;
    result = 'tab col m2';
    if (this.props.active) {
      result += ' tab-active';
    }
    return result;
  },
  render: function() {
    return React.createElement(Link, {
      "to": 'file',
      "params": {
        splat: this.props.href
      }
    }, React.createElement("li", {
      "className": this.activeClass()
    }, this.props.path));
  }
});
