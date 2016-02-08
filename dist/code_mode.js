var Link, Navigation, React, RouteHandler, Router, Tabs, _;

React = require('react');

_ = require('lodash');

Router = require('react-router');

RouteHandler = Router.RouteHandler;

Link = Router.Link;

Navigation = Router.Navigation;

Tabs = require('./tabs');

module.exports = React.createClass({
  mixins: [Navigation],
  fullPath: function() {
    return this.props.params.splat;
  },
  tabs: function() {
    var tabs;
    tabs = _.map(this.tabPaths(), (function(_this) {
      return function(tab_path) {
        var name, path, tab_data;
        path = tab_path.replace(/\*$/, '');
        name = _.last(path.split('/'));
        return tab_data = {
          path: path,
          name: name,
          active: path === _this.activeTabPath()
        };
      };
    })(this));
    return _.map(tabs, (function(_this) {
      return function(tab) {
        tab.href = _this.href(tabs, tab);
        tab.close_href = _this.closeHref(tabs, tab);
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
    active_with_asterix = _.find(this.tabPaths(), function(tab_path) {
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
    new_tab_list = _.map(_.cloneDeep(tabs), function(tab) {
      var updated_tab;
      updated_tab = tab;
      updated_tab.active = updated_tab.path === new_active_tab.path;
      return updated_tab;
    });
    return this.joinTabPaths(new_tab_list);
  },
  closeHref: function(tabs, close_tab) {
    var last_tab, new_tab_list;
    new_tab_list = _.reject(_.cloneDeep(tabs), function(tab) {
      return tab.path === close_tab.path;
    });
    _.each(new_tab_list, function(tab) {
      return tab.active = false;
    });
    last_tab = _.last(new_tab_list);
    if (last_tab) {
      last_tab.active = true;
    }
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
    unique_tabs = _.uniqBy(_.flatten([this.tabs(), new_active_tab]), 'path');
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
    unique_tabs = _.uniqBy(new_tabs, 'path');
    with_active_tab = _.map(unique_tabs, function(tab) {
      if (tab.path === path) {
        tab.active = true;
      }
      return tab;
    });
    return this.joinTabPaths(with_active_tab);
  },
  checkValidPath: function() {
    if (!this.fullPath()) {
      return this.transitionTo('file', {
        splat: '*'
      });
    }
  },
  render: function() {
    this.checkValidPath();
    return React.createElement("div", null, React.createElement("div", {
      "className": 'row full'
    }, React.createElement("div", {
      "className": 'col m12 full code-mode-cols'
    }, React.createElement(Tabs, {
      "tabs": this.tabs(),
      "new_tab_href": this.newTabHref('')
    }), React.createElement(RouteHandler, {
      "active_tab_path": this.activeTabPath(),
      "reuseTabHref": this.reuseTabHref,
      "newTabHref": this.newTabHref,
      "editorChange": this.props.editorChange
    }))));
  }
});
