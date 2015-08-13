var Link, React, Router, Tab, _;

React = require('react/addons');

_ = require('lodash');

Router = require('react-router');

Link = Router.Link;

Tab = require('./tab');

module.exports = React.createClass({
  render: function() {
    return React.createElement("div", null, _.map(this.props.tabs, (function(_this) {
      return function(tab) {
        return React.createElement(Tab, {
          "href": tab.href,
          "path": tab.path,
          "active": tab.active
        });
      };
    })(this)), React.createElement(Link, {
      "to": 'file',
      "params": {
        splat: this.props.new_tab_href
      }
    }, React.createElement("div", null, "New tab")));
  }
});
