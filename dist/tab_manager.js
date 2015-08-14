var Editor, FileManager, Filesystem, React, _;

React = require('react/addons');

_ = require('lodash');

Editor = require('./editor');

FileManager = require('./file_manager');

Filesystem = require('./filesystem');

module.exports = React.createClass({
  renderEditor: function(file) {
    return React.createElement(Editor, {
      "value": file.content,
      "path": this.props.active_tab_path,
      "onChange": this.props.editorChange
    });
  },
  renderFileManager: function(dir) {
    return React.createElement(FileManager, {
      "dir": dir,
      "path": this.props.active_tab_path,
      "reuseTabHref": this.props.reuseTabHref,
      "newTabHref": this.props.newTabHref
    });
  },
  render: function() {
    var file_or_dir;
    file_or_dir = Filesystem.read(this.props.active_tab_path);
    if (file_or_dir.type === 'dir') {
      return this.renderFileManager(file_or_dir);
    } else {
      return this.renderEditor(file_or_dir);
    }
  }
});
