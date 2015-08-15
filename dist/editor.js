var AceEditor, React, _, brace;

React = require('react');

brace = require('brace');

AceEditor = require('react-ace');

_ = require('lodash');

require('brace/mode/html');

require('brace/mode/coffee');

require('brace/mode/jade');

require('brace/mode/sass');

require('brace/theme/xcode');

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
      coffee: 'coffee',
      sass: 'sass',
      scss: 'sass'
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
