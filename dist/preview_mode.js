var Browser, React;

React = require('react/addons');

Browser = require('./browser');

module.exports = React.createClass({
  render: function() {
    return React.createElement("div", null, React.createElement("div", {
      "className": 'row'
    }, React.createElement("div", {
      "className": 'col browser-col full m12'
    }, React.createElement(Browser, {
      "ref": 'browser'
    }))));
  }
});
