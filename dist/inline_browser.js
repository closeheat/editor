var React, inlineInject;

React = require('react');

window._ = require('lodash');

inlineInject = function() {
  var bindEvent, event, events, getSelector, i, len, positionInDom, results;
  positionInDom = function(el, count) {
    var new_el;
    if (count == null) {
      count = 1;
    }
    if (new_el = el.previousElementSibling) {
      return positionInDom(new_el, count + 1);
    } else {
      return count;
    }
  };
  getSelector = function(el) {
    var c, e, names;
    names = [];
    while (el.parentNode) {
      if (el.id) {
        names.unshift('#' + el.id);
        break;
      } else {
        if (el === el.ownerDocument.documentElement) {
          names.unshift(el.tagName.toLowerCase());
        } else {
          c = 1;
          e = el;
          while (e.previousElementSibling) {
            e = e.previousElementSibling;
            c++;
          }
          names.unshift(el.tagName.toLowerCase() + ':nth-child(' + c + ')');
        }
        el = el.parentNode;
      }
    }
    return names.join(' > ');
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
