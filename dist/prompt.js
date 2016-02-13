var ContentEditable, Draggabilly, React, ReactDOM, autosize;

React = require('react');

ReactDOM = require('react-dom');

ContentEditable = require('react-wysiwyg');

Draggabilly = require('draggabilly');

autosize = require('autosize');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      value: this.originalValue(this.props),
      attributes: this.attributes()
    };
  },
  originalValue: function(props) {
    return props.element_data.text;
  },
  onChange: function(e) {
    return this.setState({
      value: e.target.value
    });
  },
  onApply: function() {
    return this.props.onApply(this.state.value, this.state.attributes);
  },
  componentWillReceiveProps: function(next_props) {
    return this.setState({
      value: this.originalValue(next_props)
    });
  },
  componentDidMount: function() {
    new Draggabilly(ReactDOM.findDOMNode(this), {
      handle: '.prompt-header'
    });
    return autosize(this.refs.content);
  },
  isLink: function() {
    return this.props.element_data.node.parentNode.tagName === 'A';
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
  attributes: function() {
    return _.map(this.attributeArray(), function(attribute) {
      return _.pick(attribute, ['name', 'value']);
    });
  },
  attributeArray: function() {
    return Array.prototype.slice.call(this.props.element_data.selector_element.attributes);
  },
  changeAttribute: function(name, new_value) {
    var attribute, result;
    result = _.cloneDeep(this.state.attributes);
    attribute = _.find(result, {
      name: name
    });
    attribute.value = new_value;
    return this.setState({
      attributes: result
    });
  },
  attributeFields: function() {
    return React.createElement("div", {
      "className": 'prompt-attributes'
    }, _.map(this.state.attributes, (function(_this) {
      return function(attribute) {
        var dom_id;
        dom_id = "attribute-" + attribute.name;
        return React.createElement("div", {
          "key": attribute.name,
          "className": 'prompt-attribute'
        }, React.createElement("label", {
          "className": 'prompt-attribute-label',
          "htmlFor": dom_id
        }, attribute.name), React.createElement("input", {
          "id": dom_id,
          "className": 'prompt-input',
          "value": attribute.value,
          "onChange": (function(e) {
            return _this.changeAttribute(attribute.name, e.target.value);
          })
        }));
      };
    })(this)));
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
      "rows": 1.,
      "ref": 'content',
      "className": 'prompt-input',
      "onChange": this.onChange,
      "value": this.state.value
    }), !!this.state.attributes.length && this.attributeFields()), React.createElement("div", {
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
