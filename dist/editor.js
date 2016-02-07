var AceEditor, React, _, brace;

React = require('react');

brace = require('brace');

AceEditor = require('react-ace');

_ = require('lodash');

require('brace/mode/html');

require('brace/mode/jade');

require('brace/mode/markdown');

require('brace/mode/text');

require('brace/mode/javascript');

require('brace/mode/coffee');

require('brace/mode/jsx');

require('brace/mode/json');

require('brace/mode/css');

require('brace/mode/sass');

require('brace/theme/xcode');

require('brace/ext/searchbox');

module.exports = React.createClass({
  emptySelection: function() {
    return {
      start: {
        row: 0,
        column: 0
      },
      end: {
        row: 0,
        column: 0
      }
    };
  },
  onChange: function(new_content) {
    return this.props.onChange(this.props.path, new_content);
  },
  mode: function() {
    var ext;
    ext = this.props.path.match(/\.(.*)$/)[1] || 'html';
    return this.props.supported_modes[ext] || 'html';
  },
  restoreSettings: function(editor) {
    var settings;
    settings = window.CloseheatFileSettings[this.props.path];
    if (!settings) {
      return editor.clearSelection();
    }
    editor.session.selection.setSelectionRange(settings.selection);
    editor.session.setScrollTop(settings.scroll_top);
    editor.session.setScrollLeft(settings.scroll_left);
    settings.undo_manager.$doc = editor.session;
    return editor.session.setUndoManager(settings.undo_manager);
  },
  onLoad: function(editor) {
    var editor_session;
    editor_session = editor.getSession();
    editor_session.setTabSize(2);
    editor_session.setUseSoftTabs(true);
    editor.setHighlightActiveLine(false);
    editor_session.setUndoManager(new brace.UndoManager);
    return this.restoreSettings(editor);
  },
  saveSettings: function() {
    var editor;
    editor = this.refs.editor_container.editor;
    return window.CloseheatFileSettings[this.props.path] = {
      selection: editor.getSelectionRange() || this.emptySelection(),
      scroll_top: editor.session.getScrollTop() || 0,
      scroll_left: editor.session.getScrollLeft() || 0,
      undo_manager: editor.session.getUndoManager()
    };
  },
  render: function() {
    return React.createElement(AceEditor, {
      "mode": this.mode(),
      "theme": 'xcode',
      "name": 'blah1',
      "height": 'calc(100vh - 54px - 36px)',
      "width": '100%',
      "onChange": this.onChange,
      "onLoad": this.onLoad,
      "value": this.props.value,
      "ref": 'editor_container',
      "editorProps": {
        $blockScrolling: true
      }
    });
  }
});
