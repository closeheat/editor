var Browser, React;

React = require('react');

module.exports = Browser = React.createClass({
  refresh: function() {
    return document.getElementById('browser').src = this.props.browser_url;
  },
  render: function() {
    return React.createElement("div", {
      "className": 'browser'
    }, React.createElement("iframe", {
      "id": 'browser',
      "name": 'browser-frame',
      "src": this.props.browser_url
    }));
  }
});
