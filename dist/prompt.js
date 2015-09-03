var ContentEditable, React;

React = require('react/addons');

ContentEditable = require('react-wysiwyg');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      value: this.props.element_data.element.html(),
      initial_style: this.initialStyle()
    };
  },
  initialStyle: function() {
    var original_styles, position_style;
    position_style = {
      position: 'absolute',
      width: this.props.element_data.width,
      height: this.props.element_data.height,
      backgroundColor: 'rgb(24, 30, 44)',
      border: 0,
      outline: '3px solid white'
    };
    original_styles = _.pick(JSON.parse(this.props.element_data.style), 'font', 'padding', 'color', 'lineHeight', 'textAlign', 'textTransform');
    return _.merge(original_styles, position_style);
  },
  onChange: function(new_value) {
    return this.setState({
      value: new_value
    });
  },
  style: function() {
    var result;
    result = this.state.initial_style;
    result.top = this.props.element_data.top + 54 - this.props.iframe_scroll_top;
    result.left = this.props.element_data.left - this.props.iframe_scroll_left;
    return result;
  },
  render: function() {
    return React.createElement(ContentEditable, {
      "key": this.props.iframe_scroll_top,
      "tagName": 'div',
      "onChange": this.onChange,
      "html": this.state.value,
      "preventStyling": true,
      "noLinebreaks": true,
      "editing": true,
      "style": this.style()
    });
  }
});
