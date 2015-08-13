var Link, Navigation, React, Router, Tab, _;

React = require('react/addons');

_ = require('lodash');

Router = require('react-router');

Link = Router.Link;

Navigation = Router.Navigation;

Tab = require('./tab');

module.exports = React.createClass({
  mixins: [Navigation],
  open: function() {
    return this.transitionTo('file', {
      splat: this.newUrl()
    });
  },
  newUrl: function() {
    var currently_active, result;
    if (this.props.full_path.match(RegExp("^" + this.props.path + "\\*?$"))) {
      return this.props.path;
    } else if (this.props.full_path.match(RegExp("&" + this.props.path + "\\*$"))) {
      return this.props.path;
    } else if (this.props.full_path.match(RegExp(this.props.path + "[^*]"))) {
      currently_active = this.props.full_path.match(/&(.+)\*$/)[0];
      result = this.props.full_path.replace(RegExp(currently_active + "\\*"), currently_active);
      debugger;
      return this.props.full_match;
    }
  },
  tabs: function() {
    var active, tab_paths;
    tab_paths = this.props.full_path.split('&');
    active = _.detect(tab_paths, function(tab_path) {
      return _.last(tab_path) === '*';
    });
    return _.map(tab_paths, function(tab_path) {
      return {
        path: tab_path.replace(/\*$/, ''),
        active: tab_path === active
      };
    });
  },
  href: function(new_active_tab) {
    var new_tab_list, tab_paths;
    new_tab_list = _.map(this.tabs(), function(tab) {
      var updated_tab;
      updated_tab = tab;
      updated_tab.active = updated_tab.path === new_active_tab.path;
      return updated_tab;
    });
    tab_paths = _.map(new_tab_list, function(tab) {
      if (tab.active) {
        return tab.path + '*';
      } else {
        return tab.path;
      }
    });
    return tab_paths.join('&');
  },
  render: function() {
    return React.createElement("div", null, _.map(this.tabs(), (function(_this) {
      return function(tab) {
        return React.createElement(Tab, {
          "href": _this.href(tab),
          "path": tab.path,
          "active": tab.active
        });
      };
    })(this)), React.createElement(Link, {
      "to": 'file',
      "params": {
        splat: ''
      }
    }, React.createElement("div", null, "New tab")));
  }
});
