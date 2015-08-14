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
    return this.execSequence(this.props);
  },
  componentWillReceiveProps: function(new_props) {
    return this.execSequence(new_props);
  },
  execSequence: function(props) {
    if (props.files_changed) {
      return props.build()["catch"]((function(_this) {
        return function(err) {
          return _this.props.handleError(err);
        };
      })(this));
    } else {
      return this.execPublish().then((function(_this) {
        return function(resp) {
          if (!resp.success) {
            return _this.props.handleError(resp.error);
          }
          return _this.setState({
            published: true
          });
        };
      })(this))["catch"]((function(_this) {
        return function(err) {
          return _this.props.handleError(err);
        };
      })(this));
    }
  },
  execPublish: function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return request.post({
          json: true,
          url: window.location.origin + "/apps/" + APP_SLUG + "/live_edit/publish"
        }, function(err, status, resp) {
          if (err) {
            return reject(err);
          }
          return resolve(resp);
        });
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
