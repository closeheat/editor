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
    var e;
    try {
      fs.readFileSync("/" + (this.path()));
      return true;
    } catch (_error) {
      e = _error;
      return false;
    }
  },
  path: function() {
    return this.props.params.splat;
  },
  renderFileManager: function() {
    return React.createElement(FileManager, {
      "path": this.path()
    });
  },
  render: function() {
    if (this.isFile()) {
      return this.renderEditor();
    } else {
      return this.renderFileManager();
    }
  }
});
