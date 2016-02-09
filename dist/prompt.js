var ContentEditable, React;

React = require('react');

ContentEditable = require('react-wysiwyg');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      value: this.props.element_data[this.props.element_data.winner_type].text
    };
  },
  onChange: function(new_value) {
    return this.setState({
      value: new_value
    });
  },
  onApply: function() {
    return this.props.onApply(this.state.value);
  },
  render: function() {
    console.log('renderin');
    console.log(this.state.value);
    return React.createElement("div", {
      "className": 'prompt'
    }, React.createElement(ContentEditable, {
      "tagName": 'div',
      "onChange": this.onChange,
      "html": this.state.value,
      "preventStyling": true,
      "noLinebreaks": true,
      "editing": true
    }), React.createElement("div", {
      "className": 'prompt-actions'
    }, React.createElement("span", {
      "className": 'prompt-action',
      "onClick": this.onApply
    }, "Apply"), React.createElement("span", {
      "className": 'prompt-action',
      "onClick": this.props.onClose
    }, "X")));
  }
});
