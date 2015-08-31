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
  getInitialState: function() {
    return {
      loaded: false
    };
  },
  onChange: function(new_content) {
    return this.props.onChange(this.props.path, new_content);
  },
  mode: function() {
    var ext;
    ext = this.props.path.match(/\.(.*)$/)[1] || 'html';
    return this.supportedModes()[ext] || 'html';
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
  onLoad: function(editor) {
    editor.clearSelection();
    editor.getSession().setTabSize(2);
    editor.getSession().setUseSoftTabs(true);
    return editor.setHighlightActiveLine(false);
  },
  render: function() {
    return React.createElement(AceEditor, {
      "mode": this.mode(),
      "theme": 'xcode',
      "name": 'blah1',
      "height": 'calc(100vh - 50px)',
      "width": '100%',
      "onChange": this.onChange,
      "onLoad": this.onLoad,
      "value": this.props.value
    });
  }
});
