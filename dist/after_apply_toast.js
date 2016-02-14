var React;

React = require('react');

module.exports = React.createClass({
  render: function() {
    return React.createElement("div", {
      "className": 'toast-container'
    }, React.createElement("div", {
      "className": 'toast custom-toast'
    }, React.createElement("span", null, "Sweet! Just updated ", this.props.file_path), React.createElement("span", {
      "className": 'custom-toast-buttons'
    }, React.createElement("span", {
      "className": 'btn-flat yellow-text',
      "onClick": this.props.onReview
    }, "Review"), React.createElement("span", {
      "className": 'btn-flat red-text text-lighten-4',
      "onClick": this.props.onUndo
    }, "Undo"), React.createElement("span", {
      "className": 'btn-flat blue-text text-lighten-4',
      "onClick": this.props.onClose
    }, "Dismiss"))));
  }
});
