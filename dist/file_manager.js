var React;

React = require('react/addons');

module.exports = React.createClass({
  render: function() {
    return React.createElement("div", null, React.createElement("div", {
      "className": 'row'
    }, React.createElement("div", {
      "className": 'col editor-col full m12'
    }, React.createElement("div", {
      "className": 'editor'
    }, "FILES BE HERE"))));
  }
});
