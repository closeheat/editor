var $, Header, PublishStatus, React, Tour, _;

React = require('react/addons');

PublishStatus = require('./publish_status');

Tour = require('./tour');

_ = require('lodash');

$ = window.jQuery = window.$ = require('jquery');

module.exports = Header = React.createClass({
  getInitialState: function() {
    return {};
  },
  goToStep: function(tour_step) {},
  activeModeClass: function(type, cols) {
    var obj;
    return React.addons.classSet((
      obj = {
        col: true,
        'header-mode': true,
        'center-align': true
      },
      obj["" + cols] = true,
      obj['header-mode-active'] = this.props.active_mode === type,
      obj['header-in-progress'] = this.props.action_in_progress && type !== 'code',
      obj
    ));
  },
  componentDidMount: function() {
    return this.addTooltips();
  },
  componentDidUpdate: function() {
    return this.addTooltips();
  },
  addTooltips: function() {
    var elements;
    elements = _.map(['code', 'preview', 'publish', 'avatar'], (function(_this) {
      return function(name) {
        return React.findDOMNode(_this.refs[name]);
      };
    })(this));
    return $(elements).tooltip({
      delay: 100
    });
  },
  prettyWebsiteUrl: function() {
    return this.props.website_url.replace('http://', '');
  },
  render: function() {
    var dashboard_url;
    dashboard_url = "http://app.closeheat.com/apps/" + APP_SLUG + "/";
    return React.createElement("div", null, React.createElement("div", {
      "className": 'row header-row'
    }, React.createElement("div", {
      "className": this.activeModeClass('code', 'label-with-icon s2'),
      "onClick": this.props.onCodeClick,
      "data-tooltip": 'Ctrl+E',
      "ref": 'code'
    }, React.createElement("i", {
      "className": 'material-icons'
    }, "code"), "Code"), React.createElement("div", {
      "className": this.activeModeClass('preview', 'label-with-icon s2 m3'),
      "onClick": this.props.onPreviewClick,
      "data-tooltip": 'Ctrl+S',
      "ref": 'preview'
    }, React.createElement("i", {
      "className": 'material-icons'
    }, "navigation"), "Preview Changes"), React.createElement("div", {
      "className": 'header-website-url col s4 m3 center-align label-with-icon'
    }, React.createElement("a", {
      "href": this.props.website_url,
      "target": '_blank',
      "className": 'truncate'
    }, this.prettyWebsiteUrl(), React.createElement("i", {
      "className": 'material-icons header-icon-right'
    }, "open_in_new"))), React.createElement("div", {
      "className": this.activeModeClass('publish', 's2 label-with-icon'),
      "onClick": this.props.onPublishClick,
      "data-tooltip": "Publishes changes to " + (this.prettyWebsiteUrl()),
      "ref": 'publish'
    }, React.createElement("i", {
      "className": 'material-icons'
    }, "publish"), "Publish"), React.createElement("div", {
      "className": 'header-support col s1 center-align'
    }, React.createElement("a", {
      "href": "mailto:domas@closeheat?subject=I'm having a problem with the editor"
    }, "Support")), React.createElement("div", {
      "className": 'col s1 center-align'
    }, React.createElement("a", {
      "href": dashboard_url,
      "target": '_blank',
      "className": 'header-avatar',
      "ref": 'avatar',
      "data-tooltip": 'Dashboard'
    }, React.createElement("img", {
      "src": this.props.avatar
    })))), React.createElement(Tour, {
      "step": this.state.tour_step,
      "done": this.state.tour_done
    }));
  }
});
