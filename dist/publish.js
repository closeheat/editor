var Loader, Promise, React, request;

React = require('react/addons');

Promise = require('bluebird');

request = require('request');

Loader = require('./loader');

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
      return React.createElement("h2", null, "Published");
    } else {
      return React.createElement(Loader, {
        "title": 'Publishing your website...'
      });
    }
  }
});
