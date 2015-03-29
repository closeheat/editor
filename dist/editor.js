var AceEditor, Editor, React;

React = require('react');

AceEditor = require('react-ace');

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
    return React.createElement("div", {
      "className": 'col-xs-6 col-md-6 editor'
    }, React.createElement(AceEditor, {
      "mode": 'java',
      "theme": 'github',
      "name": 'blah1',
      "height": '6em',
      "onChange": this.onChange,
      "value": this.props.value
    }));
  }
});
