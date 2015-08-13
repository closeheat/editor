var Browser, React;

React = require('react/addons');

Browser = require('./browser');

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
    })(this))["catch"](function(err) {
      return console.log(err);
    });
  },
  building: function() {
    return React.createElement("h1", null, "Building");
  },
  browser: function() {
    return React.createElement("div", null, React.createElement("div", {
      "className": 'row'
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
      return this.building();
    }
  }
});
