var Link, React, RouteHandler, Router, Tabs, _;

React = require('react/addons');

_ = require('lodash');

Router = require('react-router');

RouteHandler = Router.RouteHandler;

Link = Router.Link;

Tabs = require('./tabs');

module.exports = React.createClass({
  fullPath: function() {
    return this.props.params.splat;
  },
  tabs: function() {
    var tabs;
    tabs = _.map(this.tabPaths(), (function(_this) {
      return function(tab_path) {
        var path, tab_data;
        path = tab_path.replace(/\*$/, '');
        return tab_data = {
          path: path,
          active: path === _this.activeTabPath()
        };
      };
    })(this));
    return _.map(tabs, (function(_this) {
      return function(tab) {
        tab.href = _this.href(tabs, tab);
        return tab;
      };
    })(this));
  },
  tabPaths: function() {
    if (!this.fullPath()) {
      return [];
    }
    return this.fullPath().split('&');
  },
  activeTabPath: function() {
    var active_with_asterix;
    active_with_asterix = _.detect(this.tabPaths(), function(tab_path) {
      return _.last(tab_path) === '*';
    });
    if (active_with_asterix) {
      return active_with_asterix.slice(0, -1);
    } else {
      return this.fullPath();
    }
  },
  href: function(tabs, new_active_tab) {
    var new_tab_list;
    new_tab_list = _.map(tabs, function(tab) {
      var updated_tab;
      updated_tab = tab;
      updated_tab.active = updated_tab.path === new_active_tab.path;
      return updated_tab;
    });
    return this.joinTabPaths(new_tab_list);
  },
  joinTabPaths: function(tabs) {
    var tab_paths;
    tab_paths = _.map(tabs, function(tab) {
      if (tab.active) {
        return tab.path + '*';
      } else {
        return tab.path;
      }
    });
    return tab_paths.join('&');
  },
  newTabHref: function(path) {
    var new_active_tab, unique_tabs;
    new_active_tab = {
      path: path,
      active: true
    };
    unique_tabs = _.uniq(_.flatten([this.tabs(), new_active_tab]), function(tab) {
      return tab.path;
    });
    return this.href(unique_tabs, new_active_tab);
  },
  reuseTabHref: function(path) {
    var new_tabs, unique_tabs, with_active_tab;
    new_tabs = _.map(this.tabs(), function(tab) {
      if (tab.active) {
        tab.path = path;
      }
      return tab;
    });
    unique_tabs = _.uniq(new_tabs, function(tab) {
      return tab.path;
    });
    with_active_tab = _.map(unique_tabs, function(tab) {
      if (tab.path === path) {
        tab.active = true;
      }
      return tab;
    });
    return this.joinTabPaths(with_active_tab);
  },
  render: function() {
    return React.createElement("div", null, React.createElement("div", {
      "className": 'row'
    }, React.createElement("div", {
      "className": 'col m12 code-mode-cols'
    }, React.createElement(Tabs, {
      "tabs": this.tabs(),
      "new_tab_href": this.newTabHref('/')
    }), React.createElement(RouteHandler, {
      "active_tab_path": this.activeTabPath(),
      "reuseTabHref": this.reuseTabHref,
      "newTabHref": this.newTabHref,
      "editorChange": this.props.editorChange
    }))));
  }
});
