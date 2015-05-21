var AceEditor, Editor, React, brace;

React = require('react');

brace = require('brace');

AceEditor = require('react-ace');

require('brace/mode/html');

require('brace/mode/jade');

require('brace/theme/github');

module.exports = Editor = React.createClass({
  getInitialState: function() {
    return {
      loaded: false
    };
  },
  onChange: function(new_content) {
    return this.props.onChange(new_content);
  },
  mode: function() {
    if (this.props.index_filename === '/index.jade') {
      return 'jade';
    } else {
      return 'html';
    }
  },
  render: function() {
    return React.createElement(AceEditor, {
      "mode": this.mode(),
      "theme": 'github',
      "name": 'blah1',
      "height": 'calc(100vh - 100px)',
      "width": '100%',
      "onChange": this.onChange,
      "value": this.props.value
    });
  }
});
