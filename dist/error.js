var Promise, React, request;

React = require('react/addons');

Promise = require('bluebird');

request = require('request');

module.exports = React.createClass({
  render: function() {
    return React.createElement("div", null, this.props.error);
  }
});
