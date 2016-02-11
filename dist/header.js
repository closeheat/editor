var Header, PublishStatus, React, ReactDOM, Tour, _, classNames;

React = require('react');

ReactDOM = require('react-dom');

classNames = require('classnames');

_ = require('lodash');

PublishStatus = require('./publish_status');

Tour = require('./tour');

module.exports = Header = React.createClass({
  getInitialState: function() {
    return {};
  },
  goToStep: function(tour_step) {},
  activeModeClass: function(type, cols) {
    var obj;
    return classNames((
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
    this.addTooltips();
    return this.addDropdowns();
  },
  componentDidUpdate: function() {
    this.addTooltips();
    return this.addDropdowns();
  },
  addDropdowns: function() {
    return $(this.refs.dropdown_button).dropdown({
      hover: true,
      belowOrigin: true,
      gutter: 20,
      constrain_width: false
    });
  },
  addTooltips: function() {
    var elements;
    elements = _.map(['code', 'visual', 'publish', 'website_url'], (function(_this) {
      return function(name) {
        return ReactDOM.findDOMNode(_this.refs[name]);
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
    var cli_url, dashboard_url;
    dashboard_url = "https://app.closeheat.com/apps/" + APP_SLUG + "/";
    cli_url = "https://app.closeheat.com/cli/";
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
      "className": this.activeModeClass('visual', 'label-with-icon s2'),
      "onClick": this.props.onVisualClick,
      "data-tooltip": 'Ctrl+S',
      "ref": 'visual'
    }, React.createElement("i", {
      "className": 'material-icons'
    }, "navigation"), "Visual"), React.createElement("div", {
      "className": 'header-website-url col s4 center-align label-with-icon',
      "ref": 'website_url',
      "data-tooltip": 'This is your public page URL'
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
      "href": "mailto:support@closeheat.com?subject=I'm having a problem with the editor"
    }, "Support")), React.createElement("div", {
      "ref": 'dropdown_button',
      "className": 'col s1 center-align dropdown-button',
      "data-activates": 'avatar-dropdown'
    }, React.createElement("div", {
      "className": 'header-avatar'
    }, React.createElement("img", {
      "src": this.props.avatar
    })))), React.createElement("ul", {
      "id": 'avatar-dropdown',
      "className": 'dropdown-content'
    }, React.createElement("li", null, React.createElement("a", {
      "href": 'javascript:void(0);',
      "onClick": this.props.onSettingsClick
    }, "Settings")), React.createElement("li", null, React.createElement("a", {
      "href": dashboard_url,
      "target": '_blank'
    }, "Website Dashboard")), React.createElement("li", null, React.createElement("a", {
      "href": cli_url,
      "target": '_blank'
    }, "Command Line Tools")), React.createElement("li", null, React.createElement("a", {
      "href": 'javascript:void(0);',
      "onClick": this.props.onNewWebsiteClick
    }, "Create a New Website"))), React.createElement(Tour, {
      "step": this.state.tour_step,
      "done": this.state.tour_done
    }));
  }
});
