var React;

React = require('react');

module.exports = React.createClass({
  render: function() {
    console.log(this.props.data);
    return React.createElement("div", {
      "className": 'hold-loader',
      "style": {
        top: this.props.data.top,
        left: this.props.data.left
      }
    }, React.createElement("span", {
      "className": 'hold-loader-bar'
    }));
  }
});
