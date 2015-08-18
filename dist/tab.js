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
    return React.createElement("li", {
      "className": this.activeClass()
    }, React.createElement(Link, {
      "className": 'tab-name',
      "to": 'file',
      "params": {
        splat: this.props.href
      }
    }, this.props.path || 'Files'), React.createElement(Link, {
      "className": 'tab-close',
      "to": 'file',
      "params": {
        splat: this.props.close_href
      }
    }, React.createElement("i", {
      "className": 'material-icons'
    }, "close")));
  }
});
