var Promise, React, request;

React = require('react/addons');

Promise = require('bluebird');

request = require('request');

module.exports = React.createClass({
  getInitialState: function() {
    if (!this.props.error) {
      this.props.transitionWithCodeModeHistory('code', '/code/*?');
    }
    return {};
  },
  message: function() {
    var msg;
    msg = this.props.error.toString();
    return msg.replace("\n", '<br>');
  },
  render: function() {
    return React.createElement("div", {
      "className": 'error valign-wrapper'
    }, React.createElement("div", {
      "className": 'valign'
    }, React.createElement("div", {
      "className": 'row'
    }, React.createElement("div", {
      "className": 'error-container col offset-s2 s8 offset-l3 l6'
    }, React.createElement("div", {
      "className": 'error-title'
    }, "Oops. An error occured."), React.createElement("div", {
      "className": 'error-content',
      "dangerouslySetInnerHTML": {
        __html: this.message()
      }
    })))));
  }
});
