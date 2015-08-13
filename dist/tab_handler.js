var Editor, FileManager, React;

React = require('react/addons');

Editor = require('./editor');

FileManager = require('./file_manager');

module.exports = React.createClass({
  renderEditor: function() {
    var content;
    content = fs.readFileSync("/" + (this.path())).toString();
    return React.createElement(Editor, {
      "value": content,
      "path": this.path(),
      "onChange": this.props.editorChange
    });
  },
  isFile: function() {
    debugger;
    return !!this.path();
  },
  path: function() {
    return this.props.params.splat;
  },
  renderFileManager: function() {
    return React.createElement(FileManager, null);
  },
  render: function() {
    if (this.isFile()) {
      return this.renderEditor();
    } else {
      return this.renderFileManager();
    }
  }
});
