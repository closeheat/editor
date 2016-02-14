var ContentEditable, Draggabilly, React, ReactDOM, autosize, deepDiff;

React = require('react');

ReactDOM = require('react-dom');

ContentEditable = require('react-wysiwyg');

Draggabilly = require('draggabilly');

autosize = require('autosize');

deepDiff = require('deep-diff').diff;

module.exports = React.createClass({
  getInitialState: function() {
    return this.buildState(this.props.element_data);
  },
  buildState: function(element_data) {
    return {
      value: this.originalValue(element_data),
      attributes: this.getAttributes(element_data)
    };
  },
  originalValue: function(element_data) {
    return element_data.text;
  },
  onChange: function(e) {
    return this.setState({
      value: e.target.value
    });
  },
  onApply: function() {
    if (!this.hasChanges()) {
      return this.showNoChanges();
    }
    return this.props.onApply(this.state.value, this.state.attributes);
  },
  showNoChanges: function() {
    return Materialize.toast("There are no changes to apply.", 4000);
  },
  hasChanges: function() {
    var current_values, diff, old_values;
    old_values = this.buildState(this.props.element_data);
    current_values = this.buildState({
      text: this.state.value,
      selector_element: {
        attributes: this.state.attributes
      }
    });
    diff = deepDiff(old_values, current_values);
    return diff && diff.length;
  },
  componentWillReceiveProps: function(next_props) {
    this.setState({
      value: this.originalValue(next_props.element_data),
      attributes: this.getAttributes(next_props.element_data)
    });
    return autosize(this.refs.content);
  },
  componentDidMount: function() {
    new Draggabilly(ReactDOM.findDOMNode(this), {
      handle: '.prompt-header'
    });
    return autosize(this.refs.content);
  },
  isLink: function() {
    return this.props.element_data.node.parentNode.tagName === 'A' || this.props.element_data.node.tagName === 'A';
  },
  isNestedInALink: function() {
    return this.props.element_data.node.parentElement.tagName === 'A' && this.props.element_data.node.nodeName !== '#text';
  },
  nestedType: function() {
    var NAMES, second_part;
    NAMES = {
      IMG: 'Image'
    };
    second_part = NAMES[this.props.element_data.node.nodeName] || 'Element';
    return "Linked " + second_part;
  },
  type: function() {
    if (this.isNestedInALink()) {
      return this.nestedType();
    } else if (this.isLink()) {
      return 'Link';
    } else {
      return 'Text';
    }
  },
  navigate: function() {
    return React.createElement("div", {
      "className": 'prompt-header-action',
      "onClick": this.props.onNavigate
    }, "Navigate");
  },
  editParentLink: function() {
    return React.createElement("div", {
      "className": 'prompt-extra'
    }, React.createElement("div", {
      "className": 'prompt-extra-action',
      "onClick": this.props.onEditParent
    }, "Edit link"));
  },
  actions: function() {
    if (!this.isLink()) {
      return React.createElement("div", null);
    }
    return React.createElement("div", {
      "className": 'prompt-header-actions'
    }, this.navigate());
  },
  getAttributes: function(element_data) {
    return _.map(this.attributeArray(element_data), function(attribute) {
      return _.pick(attribute, ['name', 'value']);
    });
  },
  attributeArray: function(element_data) {
    return Array.prototype.slice.call(element_data.selector_element.attributes);
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
  sortedAttributes: function() {
    var PRIORITY_ATTRIBUTES;
    PRIORITY_ATTRIBUTES = ['href', 'value', 'src', 'placeholder'];
    return _.orderBy(this.state.attributes, function(attribute) {
      return _.includes(PRIORITY_ATTRIBUTES, attribute.name);
    }, 'desc');
  },
  attributeFields: function() {
    return React.createElement("div", {
      "className": 'prompt-attributes'
    }, _.map(this.sortedAttributes(), (function(_this) {
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
  hasContent: function() {
    var NO_CONTENT_TAGS;
    NO_CONTENT_TAGS = ['INPUT', 'BUTTON', 'IMG'];
    if (_.includes(NO_CONTENT_TAGS, this.props.element_data.node.tagName)) {
      return false;
    }
    if (!this.props.element_data.text) {
      return false;
    }
    return true;
  },
  contentField: function() {
    return React.createElement("textarea", {
      "rows": 1.,
      "ref": 'content',
      "className": 'prompt-input',
      "onChange": this.onChange,
      "value": this.state.value
    });
  },
  render: function() {
    return React.createElement("div", {
      "className": 'prompt'
    }, React.createElement("div", {
      "className": 'prompt-header row'
    }, React.createElement("div", {
      "className": 'col col-no-padding s8'
    }, this.type()), React.createElement("div", {
      "className": 'col col-no-padding s4'
    }, this.actions())), React.createElement("div", {
      "className": 'prompt-content'
    }, this.hasContent() && this.contentField(), !!this.state.attributes.length && this.attributeFields(), this.isNestedInALink() && this.editParentLink()), React.createElement("div", {
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
