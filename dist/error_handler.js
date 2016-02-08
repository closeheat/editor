var Promise, React, request;

React = require('react');

Promise = require('bluebird');

request = require('request');

module.exports = React.createClass({
  componentWillMount: function() {
    if (!this.props.error) {
      this.props.transitionWithCodeModeHistory('code', '/code/*?');
    }
    return this.props.actionStopped();
  },
  getInitialState: function() {
    return {};
  },
  message: function() {
    var msg, with_n_as_enter;
    if (!this.props.error) {
      return;
    }
    msg = this.props.error.toString();
    with_n_as_enter = JSON.stringify(msg).slice(1, -1);
    return with_n_as_enter.replace(/\\n/g, '<br>');
  },
  render: function() {
    return React.createElement("div", {
      "className": 'error'
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
    }))));
  }
});
