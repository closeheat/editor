var ContentEditable, Draggabilly, React, ReactDOM;

React = require('react');

ReactDOM = require('react-dom');

ContentEditable = require('react-wysiwyg');

Draggabilly = require('draggabilly');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      value: this.originalValue(this.props)
    };
  },
  originalValue: function(props) {
    return props.element_data[props.element_data.winner_type].text;
  },
  onChange: function(e) {
    return this.setState({
      value: e.target.value
    });
  },
  onApply: function() {
    return this.props.onApply(this.state.value);
  },
  componentWillReceiveProps: function(next_props) {
    return this.setState({
      value: this.originalValue(next_props)
    });
  },
  componentDidMount: function() {
    return new Draggabilly(ReactDOM.findDOMNode(this), {
      handle: '.prompt-header'
    });
  },
  isLink: function() {
    return this.props.element_data.html.node.parentNode.tagName === 'A';
  },
  type: function() {
    if (this.isLink()) {
      return 'Link';
    } else {
      return 'Text';
    }
  },
  navigate: function() {
    if (!this.isLink()) {
      return React.createElement("div", null);
    }
    return React.createElement("div", {
      "className": 'prompt-header-navigate',
      "onClick": this.props.onNavigate
    }, "Navigate");
  },
  render: function() {
    return React.createElement("div", {
      "className": 'prompt'
    }, React.createElement("div", {
      "className": 'prompt-header row'
    }, React.createElement("div", {
      "className": 'col s8'
    }, this.type()), React.createElement("div", {
      "className": 'col s4'
    }, this.navigate())), React.createElement("div", {
      "className": 'prompt-content'
    }, React.createElement("textarea", {
      "className": 'prompt-input',
      "onChange": this.onChange,
      "value": this.state.value
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
