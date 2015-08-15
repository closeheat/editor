var Loader, Promise, Published, React, request;

React = require('react/addons');

Promise = require('bluebird');

request = require('request');

Loader = require('./loader');

Published = require('./published');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      published: false
    };
  },
  componentDidMount: function() {
    return this.props.publish().then((function(_this) {
      return function(resp) {
        return _this.setState({
          published: true
        });
      };
    })(this))["catch"]((function(_this) {
      return function(err) {
        return _this.props.handleError(err);
      };
    })(this));
  },
  render: function() {
    if (this.props.files_changed) {
      return React.createElement(Loader, {
        "title": 'Building your website...'
      });
    } else if (this.state.published) {
      return React.createElement(Published, {
        "website_url": this.props.website_url
      });
    } else {
      return React.createElement(Loader, {
        "title": 'Publishing your website...'
      });
    }
  }
});
