var AceEditor, React, _, brace;

React = require('react');

brace = require('brace');

AceEditor = require('react-ace');

_ = require('lodash');

require('brace/mode/html');

require('brace/mode/coffee');

require('brace/mode/jade');

require('brace/theme/xcode');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      loaded: false
    };
  },
  onChange: function(new_content) {
    return this.props.onChange(new_content);
  },
  mode: function() {
    var ext, result;
    ext = this.props.path.match(/\.(.*)$/)[1] || 'html';
    result = _.detect(this.supportedModes(), function(supported_ext) {
      return supported_ext === ext;
    });
    return result || 'html';
  },
  supportedModes: function() {
    return ['jade', 'html', 'coffee'];
  },
  onLoad: function(editor) {
    return editor.clearSelection();
  },
  render: function() {
    return React.createElement(AceEditor, {
      "mode": this.mode(),
      "theme": 'xcode',
      "name": 'blah1',
      "height": 'calc(100vh - 64px)',
      "width": '100%',
      "onChange": this.onChange,
      "onLoad": this.onLoad,
      "value": this.props.value
    });
  }
});
