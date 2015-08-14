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
  componentWillMount: function() {
    return this.execPublish().then((function(_this) {
      return function() {
        return _this.setState({
          published: true
        });
      };
    })(this));
  },
  execPublish: function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return request.post({
          url: window.location.origin + "/apps/" + APP_SLUG + "/live_edit/publish"
        }, function(err, status, resp) {
          if (err) {
            return reject(err);
          }
          return resolve();
        });
      };
    })(this));
  },
  render: function() {
    if (this.state.published) {
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
