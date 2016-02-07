var Browser, Loader, React;

React = require('react');

Browser = require('./browser');

Loader = require('./loader');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      build_finished: false
    };
  },
  componentDidMount: function() {
    return this.props.build().then((function(_this) {
      return function(resp) {
        return _this.setState({
          build_finished: true
        });
      };
    })(this))["catch"]((function(_this) {
      return function(err) {
        return _this.props.handleError(err);
      };
    })(this));
  },
  browser: function() {
    return React.createElement("div", null, React.createElement("div", {
      "className": 'row full'
    }, React.createElement("div", {
      "className": 'col browser-col full m12'
    }, React.createElement(Browser, {
      "ref": 'browser',
      "browser_url": this.props.browser_url
    }))));
  },
  render: function() {
    if (this.state.build_finished) {
      return this.browser();
    } else {
      return React.createElement(Loader, {
        "title": 'Hang in tight.',
        "subtitle": 'Building your page preview...'
      });
    }
  }
});
