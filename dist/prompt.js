var ContentEditable, React, ReactDOM;

React = require('react');

ReactDOM = require('react-dom');

ContentEditable = require('react-wysiwyg');

require('jquery-ui/draggable');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      value: this.props.element_data[this.props.element_data.winner_type].text
    };
  },
  onChange: function(e) {
    return this.setState({
      value: e.target.value
    });
  },
  onApply: function() {
    return this.props.onApply(this.state.value);
  },
  componentDidMount: function() {
    return $(ReactDOM.findDOMNode(this)).draggable({
      handle: '.prompt-header'
    });
  },
  render: function() {
    return React.createElement("div", {
      "className": 'prompt'
    }, React.createElement("div", {
      "className": 'prompt-header'
    }, "Text"), React.createElement("div", {
      "className": 'prompt-content'
    }, React.createElement("input", {
      "className": 'prompt-input',
      "value": this.state.value,
      "onChange": this.onChange
    })), React.createElement("div", {
      "className": 'prompt-actions row'
    }, React.createElement("div", {
      "className": 'prompt-action col s6 blue-text',
      "onClick": this.onApply
    }, "Apply"), React.createElement("div", {
      "className": 'prompt-action col s6',
      "onClick": this.props.onClose
    }, "Cancel")));
  }
});
