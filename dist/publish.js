var Loader, Promise, Published, React, request;

React = require('react/addons');

Promise = require('bluebird');

request = require('request');

Loader = require('./loader');

Published = require('./published');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      published_to_server: false,
      published_to_github: false
    };
  },
  timeoutMsg: function() {
    return "Oops. Looks like we're having problems with publishing apps. <br>Click Support in the top bar!";
  },
  render: function() {
    return React.createElement(PublishOptions, null);
  }
});
