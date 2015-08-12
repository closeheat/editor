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
    }, React.createElement(Editor, {
      "value": this.props.editor_content,
      "onChange": this.props.editorChange,
      "index_filename": this.props.index_filename
    })))));
  }
});
