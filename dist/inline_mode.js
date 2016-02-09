var Filesystem, InlineBrowser, Loader, Prompt, React, SourceFinder, _, editingPrompt, mouseoutCode, mouseoverCode;

React = require('react');

_ = require('lodash');

InlineBrowser = require('./inline_browser');

Prompt = require('./prompt');

Loader = require('./loader');

Filesystem = require('./filesystem');

SourceFinder = require('./source_finder');

editingPrompt = function() {
  return parent.postMessage({
    action: 'prompt',
    new_content: prompt('', 'CONTENT_VALUE')
  }, 'http://localhost:4000');
};

mouseoverCode = function() {
  var element;
  element = document.querySelector('SELECTOR');
  return element.style.outline = '1px solid hsla(225, 7%, 55%, .4)';
};

mouseoutCode = function() {
  var element;
  element = document.querySelector('SELECTOR');
  return element.style.outline = '';
};

module.exports = React.createClass({
  getInitialState: function() {
    return {
      build_finished: false,
      show_prompt: false,
      iframe_scroll_top: 0,
      iframe_scroll_left: 0,
      current_element_data: {}
    };
  },
  componentDidMount: function() {
    return this.build();
  },
  build: function() {
    return this.props.build().then((function(_this) {
      return function(resp) {
        return _this.setState({
          build_finished: true
        });
      };
    })(this))["catch"]((function(_this) {
      return function(err) {
        return _this.props.handleError(err);
      };
    })(this));
  },
  rebuild: function() {
    this.setState({
      build_finished: false
    });
    return this.build();
  },
  onMessage: function(e) {
    if (e.data.action === 'edit') {
      return this.onEdit(e.data);
    } else if (e.data.action === 'prompt') {
      return this.state.editing_location.element.html(e.data.new_content);
    } else if (e.data.action === 'mouseover') {

    } else if (e.data.action === 'mouseout') {

    } else if (e.data.action === 'scroll') {
      return this.onScroll(e.data);
    } else {
      debugger;
    }
  },
  onMouseover: function(event) {
    var code, element_data;
    element_data = this.editableElement(event);
    if (!element_data) {
      return;
    }
    this.setState({
      old_outline: event.old_outline
    });
    code = mouseoverCode.toString().replace('SELECTOR', element_data.selector);
    return this.refs.browser.evalInIframe(code);
  },
  onMouseout: function(event) {
    var code, element_data;
    element_data = this.editableElement(event);
    if (!element_data) {
      return;
    }
    code = mouseoutCode.toString().replace('SELECTOR', element_data.selector);
    return this.refs.browser.evalInIframe(code);
  },
  onEdit: function(event) {
    var element_data;
    element_data = this.editableElement(event);
    return this.setState({
      show_prompt: true,
      current_element_data: element_data
    });
  },
  removePrompt: function() {
    return this.setState({
      show_prompt: false,
      current_element_data: {}
    });
  },
  editableElement: function(event) {
    var final, locations;
    locations = [];
    final = new SourceFinder(event, this.editableFiles()).source();
    console.log(final);
    return final;
  },
  isEditableElement: function(locations) {
    var element;
    if (locations.length !== 1) {
      return;
    }
    element = locations[0].element;
    if (element.children().length !== 0) {
      return;
    }
    if (!element.html()) {
      return;
    }
    return true;
  },
  editableFiles: function() {
    return _.filter(Filesystem.ls(), 'editable');
  },
  onScroll: function(data) {
    return this.setState({
      iframe_scroll_top: data.top,
      iframe_scroll_left: data.left
    });
  },
  currentElementDataFile: function() {},
  onApply: function(new_text) {
    var found_element, new_source, old_text, source;
    old_text = this.state.current_element_data[this.state.current_element_data.winner_type].text;
    source = Filesystem.read(this.state.current_element_data.file).content;
    found_element = source.match(old_text);
    if (!found_element) {
      return alert('Cant find the element in code. Formatting?');
    }
    new_source = source.replace(old_text, new_text);
    console.log(new_source);
    return this.removePrompt();
  },
  prompt: function() {
    if (!this.state.show_prompt) {
      return React.createElement("div", null);
    }
    return React.createElement(Prompt, {
      "element_data": this.state.current_element_data,
      "iframe_scroll_top": this.state.iframe_scroll_top,
      "iframe_scroll_left": this.state.iframe_scroll_left,
      "onApply": this.onApply,
      "onClose": this.removePrompt
    });
  },
  browser: function() {
    return React.createElement("div", null, React.createElement("div", {
      "className": 'row'
    }, React.createElement("div", {
      "className": 'col browser-col full m12'
    }, React.createElement(InlineBrowser, {
      "ref": 'browser',
      "browser_url": 'http://localhost:9000' || this.props.browser_url,
      "onMessage": this.onMessage
    }))), this.prompt());
  },
  render: function() {
    if (this.state.build_finished) {
      return this.browser();
    } else {
      return React.createElement(Loader, {
        "title": 'Hang in tight. Building your page preview...'
      });
    }
  }
});
