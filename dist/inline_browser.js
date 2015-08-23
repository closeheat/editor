var React, inlineInject;

React = require('react');

window._ = require('lodash');

inlineInject = function() {
  var bindEvent, event, events, getSelector, i, len, positionInDom, results;
  positionInDom = function(el) {
    if (!el.previousElementSibling) {
      return 1;
    }
  };
  getSelector = function(el) {
    var class_name, classes, selector;
    selector = [];
    while (true) {
      class_name = el.className ? (classes = el.className.split(' '), '.' + classes.join('.')) : '';
      selector.unshift(el.nodeName.toLowerCase() + class_name + (":nth-child(" + (positionInDom(el)) + ")"));
      if (!((el.nodeName.toLowerCase() !== 'html') && (el = el.parentNode))) {
        break;
      }
    }
    return selector.join(' > ').replace('html > body > ', '').replace('html > body', '');
  };
  bindEvent = function(event) {
    return window.addEventListener(event, function(e) {
      var selector;
      e.preventDefault();
      selector = getSelector(e.target);
      return parent.postMessage({
        action: event,
        selector: selector,
        old_outline: e.target.outline
      }, 'http://localhost:4000');
    });
  };
  events = ['click', 'mouseover', 'mouseout'];
  results = [];
  for (i = 0, len = events.length; i < len; i++) {
    event = events[i];
    results.push(bindEvent(event));
  }
  return results;
};

module.exports = React.createClass({
  getInitialState: function() {
    window.addEventListener('message', this.props.onMessage, false);
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
  wrapEvalFunction: function(code) {
    return "evalFunction = " + code + "; evalFunction()";
  },
  inject: function() {
    return this.evalInIframe(inlineInject.toString());
  },
  evalInIframe: function(code) {
    return this.iframe().contentWindow.postMessage(this.wrapEvalFunction(code), 'http://localhost:9000');
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
