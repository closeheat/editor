var React, _;

React = require('react');

_ = require('lodash');

module.exports = React.createClass({
  distDirName: function() {
    if (this.props.dist_dir === '/' || _.isEmpty(this.props.dist_dir)) {
      return 'Root (/)';
    }
    return this.props.dist_dir;
  },
  render: function() {
    if (!this.props.show) {
      return React.createElement("div", null);
    }
    return React.createElement("div", {
      "className": 'toast-container'
    }, React.createElement("div", {
      "className": 'toast custom-toast'
    }, React.createElement("span", null, "Current public directory for this website is ", React.createElement("b", null, this.distDirName())), React.createElement("span", {
      "className": 'custom-toast-buttons'
    }, React.createElement("span", {
      "className": 'btn-flat yellow-text',
      "onClick": this.props.onClick
    }, "Change public directory"), React.createElement("span", {
      "className": 'btn-flat blue-text text-lighten-4',
      "onClick": this.props.onClose
    }, "Leave as is"))));
  }
});
