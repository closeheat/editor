var React;

React = require('react/addons');

module.exports = React.createClass({
  render: function() {
    return React.createElement("div", {
      "className": 'loader valign-wrapper'
    }, React.createElement("div", {
      "className": 'valign loader-container'
    }, React.createElement("div", {
      "className": 'row'
    }, React.createElement("div", {
      "className": "preloader-wrapper big active loader-spinner valign"
    }, React.createElement("div", {
      "className": "spinner-layer spinner-red-only"
    }, React.createElement("div", {
      "className": "circle-clipper left"
    }, React.createElement("div", {
      "className": "circle"
    })), React.createElement("div", {
      "className": "gap-patch"
    }, React.createElement("div", {
      "className": "circle"
    })), React.createElement("div", {
      "className": "circle-clipper right"
    }, React.createElement("div", {
      "className": "circle"
    }))))), React.createElement("div", {
      "className": 'row'
    }, React.createElement("div", {
      "className": 'loader-title'
    }, this.props.title))));
  }
});
