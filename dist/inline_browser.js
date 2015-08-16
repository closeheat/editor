var React, inlineInject;

React = require('react');

window._ = require('lodash');

inlineInject = function() {
  return window.addEventListener('click', function(e) {
    var class_name, el, path;
    path = [];
    el = e.target;
    while (true) {
      class_name = el.className ? '.' + el.className : '';
      path.unshift(el.nodeName.toLowerCase() + class_name);
      if (!((el.nodeName.toLowerCase() !== 'html') && (el = el.parentNode))) {
        break;
      }
    }
    return parent.postMessage({
      action: 'click',
      path: path.join(' > ')
    }, 'http://localhost:4000');
  });
};

module.exports = React.createClass({
  getInitialState: function() {
    window.addEventListener('message', this.props.onChange, false);
    return {};
  },
  iframe: function() {
    return document.getElementById('browser');
  },
  refresh: function() {
    return this.iframe().src = this.props.browser_url;
  },
  componentDidMount: function() {
    return $(this.iframe()).load((function(_this) {
      return function() {
        return _this.inject();
      };
    })(this));
  },
  injectCode: function() {
    return "inlineInject = " + (inlineInject.toString()) + "; inlineInject()";
  },
  inject: function() {
    return this.iframe().contentWindow.postMessage(this.injectCode(), 'http://localhost:9000');
  },
  render: function() {
    return React.createElement("div", {
      "className": 'browser'
    }, React.createElement("iframe", {
      "id": 'browser',
      "name": 'browser-frame',
      "src": 'http://localhost:9000' || this.props.browser_url
    }));
  }
});
