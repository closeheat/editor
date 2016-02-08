var Editor, FileManager, Filesystem, React, _;

React = require('react');

_ = require('lodash');

Editor = require('./editor');

FileManager = require('./file_manager');

Filesystem = require('./filesystem');

module.exports = React.createClass({
  renderEditor: function(file) {
    return React.createElement(Editor, {
      "value": file.content,
      "path": this.props.active_tab_path,
      "onChange": this.props.editorChange,
      "supported_modes": this.supportedModes(),
      "ref": 'editor'
    });
  },
  supportedModes: function() {
    return {
      jade: 'jade',
      html: 'html',
      md: 'markdown',
      coffee: 'coffee',
      js: 'javascript',
      jsx: 'jsx',
      json: 'json',
      sass: 'sass',
      scss: 'sass',
      css: 'css',
      txt: 'text'
    };
  },
  renderFileManager: function(dir) {
    return React.createElement(FileManager, {
      "dir": dir,
      "path": this.props.active_tab_path,
      "reuseTabHref": this.props.reuseTabHref,
      "newTabHref": this.props.newTabHref,
      "supported_modes": this.supportedModes()
    });
  },
  fileOrDir: function() {
    return Filesystem.read(this.props.active_tab_path);
  },
  statics: {
    willTransitionFrom: function(transition, component) {
      if (component.fileOrDir().type === 'dir') {
        return;
      }
      return component.refs.editor.saveSettings();
    }
  },
  render: function() {
    var file_or_dir;
    file_or_dir = this.fileOrDir();
    if (file_or_dir.type === 'dir') {
      return this.renderFileManager(file_or_dir);
    } else {
      return this.renderEditor(file_or_dir);
    }
  }
});
