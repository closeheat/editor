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
  render: function() {
    var edit_other_files_url;
    edit_other_files_url = "http://app.closeheat.com/apps/" + APP_SLUG + "/guide/toolkit";
    return React.createElement("div", null, React.createElement("div", {
      "className": 'row header-row'
    }, React.createElement("div", {
      "className": 'col s12 header-cols'
    }, React.createElement("nav", null, React.createElement("div", {
      "className": "nav-wrapper"
    }, React.createElement("ul", {
      "className": "left"
    }, React.createElement("li", null, React.createElement("a", {
      "href": "javascript:void(0)",
      "onClick": this.props.onCodeClick
    }, React.createElement("i", {
      "className": "mdi-image-remove-red-eye left"
    }), "Code")), React.createElement("li", null, React.createElement("a", {
      "href": "javascript:void(0)",
      "onClick": this.props.onPreviewClick
    }, React.createElement("i", {
      "className": "mdi-content-send left"
    }), "Preview Changes"))), React.createElement("ul", {
      "className": "right"
    }, React.createElement("li", null, React.createElement("a", {
      "href": "javascript:void(0)",
      "onClick": this.props.onPublishClick
    }, React.createElement("i", {
      "className": "mdi-content-send left"
    }), "Publish")), React.createElement("li", null, React.createElement("a", {
      "href": "javascript:void(0)",
      "onClick": this.props.onPublishClick
    }, React.createElement("i", {
      "className": "mdi-content-send left"
    }), "Support")), React.createElement("li", null, React.createElement("a", {
      "className": 'header-avatar'
    }, React.createElement("img", {
      "src": "/logo-square.png"
    })))))))), React.createElement(Tour, {
      "step": this.state.tour_step,
      "done": this.state.tour_done
    }));
  }
});
