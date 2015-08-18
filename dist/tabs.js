var Link, React, Router, Tab, _;

React = require('react/addons');

_ = require('lodash');

Router = require('react-router');

Link = Router.Link;

Tab = require('./tab');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      flash: false
    };
  },
  onNewTab: function() {
    this.setState({
      flash: true
    });
    return setTimeout(((function(_this) {
      return function() {
        return _this.setState({
          flash: false
        });
      };
    })(this)), 50);
  },
  render: function() {
    return React.createElement("ul", {
      "className": 'row tabs-row'
    }, _.map(this.props.tabs, (function(_this) {
      return function(tab) {
        return React.createElement(Tab, {
          "href": tab.href,
          "close_href": tab.close_href,
          "path": tab.path,
          "active": tab.active,
          "flash": _this.state.flash
        });
      };
    })(this)), React.createElement("li", {
      "className": 'tab tab-new col s2'
    }, React.createElement(Link, {
      "to": 'file',
      "params": {
        splat: this.props.new_tab_href
      },
      "onClick": this.onNewTab
    }, React.createElement("div", null, "+ New tab"))));
  }
});
