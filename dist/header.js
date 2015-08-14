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
    var base;
    base = "col " + cols + " header-mode center-align";
    if (this.props.active_mode !== type) {
      return base;
    }
    return base + ' header-mode-active';
  },
  render: function() {
    var edit_other_files_url;
    edit_other_files_url = "http://app.closeheat.com/apps/" + APP_SLUG + "/guide/toolkit";
    return React.createElement("div", null, React.createElement("div", {
      "className": 'row header-row'
    }, React.createElement("div", {
      "className": this.activeModeClass('code', 's2'),
      "onClick": this.props.onCodeClick
    }, React.createElement("i", {
      "className": 'material-icons'
    }, "code"), "Code"), React.createElement("div", {
      "className": this.activeModeClass('preview', 's2'),
      "onClick": this.props.onPreviewClick
    }, React.createElement("i", {
      "className": 'material-icons'
    }, "navigation"), "Preview Changes"), React.createElement("div", {
      "className": 'header-website-url col s4 center-align',
      "onClick": this.props.onPublishClick
    }, React.createElement("a", {
      "href": this.props.website_url,
      "target": '_blank'
    }, this.props.website_url.replace('http://', ''), React.createElement("i", {
      "className": 'material-icons'
    }, "open_in_new"))), React.createElement("div", {
      "className": this.activeModeClass('publish', 's2'),
      "onClick": this.props.onPublishClick
    }, React.createElement("i", {
      "className": 'material-icons'
    }, "navigation"), "Publish"), React.createElement("div", {
      "className": 'header-support col s1 center-align'
    }, React.createElement("a", {
      "href": "mailto:domas@closeheat?subject=I'm having a problem with the editor"
    }, "Support")), React.createElement("div", {
      "className": 'col s1 header-mode center-align',
      "onClick": this.props.onPublishClick
    }, React.createElement("a", {
      "className": 'header-avatar'
    }, React.createElement("img", {
      "src": "/logo-square.png"
    })))), React.createElement(Tour, {
      "step": this.state.tour_step,
      "done": this.state.tour_done
    }));
  }
});
