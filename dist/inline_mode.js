var Filesystem, InlineBrowser, Loader, React, _, editingPrompt, mouseoutCode, mouseoverCode;

React = require('react/addons');

_ = require('lodash');

InlineBrowser = require('./inline_browser');

Loader = require('./loader');

Filesystem = require('./filesystem');

editingPrompt = function() {
  return parent.postMessage({
    action: 'prompt',
    new_content: prompt('', 'CONTENT_VALUE')
  }, 'http://localhost:4000');
};

mouseoverCode = function() {
  var element;
  element = document.querySelector('SELECTOR');
  return element.style.outline = '1px solid #E5E5E5';
};

mouseoutCode = function() {
  var element;
  element = document.querySelector('SELECTOR');
  return element.style.outline = '';
};

module.exports = React.createClass({
  getInitialState: function() {
    return {
      build_finished: false
    };
  },
  componentDidMount: function() {
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
  onMessage: function(e) {
    if (e.data.action === 'click') {
      return this.onClick(e.data);
    } else if (e.data.action === 'prompt') {
      return this.state.editing_location.element.html(e.data.new_content);
    } else if (e.data.action === 'mouseover') {
      return this.onMouseover(e.data);
    } else if (e.data.action === 'mouseout') {
      return this.onMouseout(e.data);
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
  onClick: function(event) {
    var element_data;
    element_data = this.editableElement(event);
    if (!element_data) {
      return;
    }
    debugger;
    return this.refs.browser.evalInIframe(editingPrompt.toString().replace('CONTENT_VALUE', element_data.element.html()));
  },
  editableElement: function(event) {
    var locations;
    locations = [];
    _.each(this.htmlFiles(), (function(_this) {
      return function(file) {
        var dom, element;
        dom = $('<html>').html(file.content);
        element = dom.find(event.selector);
        return locations.push({
          file: file,
          element: element,
          dom: dom,
          selector: event.selector
        });
      };
    })(this));
    if (!this.isEditableElement(locations)) {
      return;
    }
    return locations[0];
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
  htmlFiles: function() {
    return _.select(Filesystem.ls(), function(file) {
      return file.path.match(/\.html$/);
    });
  },
  browser: function() {
    return React.createElement("div", null, React.createElement("div", {
      "className": 'row'
    }, React.createElement("div", {
      "className": 'col browser-col full m12'
    }, React.createElement(InlineBrowser, {
      "ref": 'browser',
      "browser_url": this.props.browser_url,
      "onMessage": this.onMessage
    }))));
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
