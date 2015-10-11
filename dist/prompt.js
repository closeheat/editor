var ContentEditable, React;

React = require('react/addons');

ContentEditable = require('react-wysiwyg');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      value: this.props.element_data.element.html(),
      field_style: this.initialStyle()
    };
  },
  initialStyle: function() {
    var field_styles, original_styles;
    field_styles = {
      width: this.props.element_data.width,
      height: this.props.element_data.height,
      border: 0
    };
    original_styles = _.pick(JSON.parse(this.props.element_data.style), 'color', 'font', 'padding', 'lineHeight', 'textAlign', 'textTransform');
    return _.merge(original_styles, field_styles);
  },
  onChange: function(new_value) {
    return this.setState({
      value: new_value
    });
  },
  onSave: function() {
    return this.props.onSave(this.state.value);
  },
  positionStyle: function() {
    return {
      position: 'absolute',
      top: this.props.element_data.top + 54 - this.props.iframe_scroll_top - 20,
      left: this.props.element_data.left - this.props.iframe_scroll_left
    };
  },
  render: function() {
    return React.createElement("div", {
      "className": 'prompt',
      "style": this.positionStyle(),
      "key": this.props.iframe_scroll_top
    }, React.createElement("div", {
      "className": 'prompt-actions'
    }, React.createElement("div", {
      "className": 'prompt-action',
      "onClick": this.onSave
    }, "Save")), React.createElement(ContentEditable, {
      "tagName": 'div',
      "onChange": this.onChange,
      "html": this.state.value,
      "preventStyling": true,
      "noLinebreaks": true,
      "editing": true,
      "style": this.state.field_style
    }));
  }
});
