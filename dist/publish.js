var Loader, Promise, Published, React, request;

React = require('react');

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
  componentDidMount: function() {
    return this.props.publishToGithub().then((function(_this) {
      return function(resp) {
        _this.setState({
          published_to_github: true
        });
        return _this.props.waitForPublishToServer().timeout(60000, _this.timeoutMsg()).then(function() {
          return _this.setState({
            published_to_server: true
          });
        });
      };
    })(this))["catch"]((function(_this) {
      return function(err) {
        return _this.props.handleError(err);
      };
    })(this));
  },
  timeoutMsg: function() {
    return "Oops. Looks like we're having problems with publishing apps. <br>Click Support in the top bar!";
  },
  render: function() {
    if (this.props.files_changed) {
      return React.createElement(Loader, {
        "title": 'Building your website...'
      });
    } else if (this.state.published_to_server) {
      return React.createElement(Published, {
        "website_url": this.props.website_url
      });
    } else if (this.state.published_to_github) {
      return React.createElement(Loader, {
        "title": 'Your files are now in Github.',
        "subtitle": 'Publishing to server (~30 sec)...'
      });
    } else {
      return React.createElement(Loader, {
        "title": 'I am publishing your landing page...'
      });
    }
  }
});
