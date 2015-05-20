var AceEditor, Editor, React, brace;

React = require('react');

brace = require('brace');

AceEditor = require('react-ace');

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
  render: function() {
    return React.createElement(AceEditor, {
      "mode": 'jade',
      "theme": 'github',
      "name": 'blah1',
      "height": 'calc(100vh - 100px)',
      "width": '100%',
      "onChange": this.onChange,
      "value": this.props.value
    });
  }
});
