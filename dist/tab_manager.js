var Editor, FileManager, React, _;

React = require('react/addons');

_ = require('lodash');

Editor = require('./editor');

FileManager = require('./file_manager');

module.exports = React.createClass({
  renderEditor: function() {
    var content;
    content = fs.readFileSync("/" + this.props.active_tab_path).toString();
    return React.createElement(Editor, {
      "value": content,
      "path": this.props.active_tab_path,
      "onChange": this.props.editorChange
    });
  },
  isFile: function() {
    var e;
    try {
      fs.readFileSync("/" + this.props.active_tab_path);
      return true;
    } catch (_error) {
      e = _error;
      return false;
    }
  },
  renderFileManager: function() {
    return React.createElement(FileManager, {
      "path": this.props.active_tab_path,
      "reuseTabHref": this.props.reuseTabHref,
      "newTabHref": this.props.newTabHref
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
