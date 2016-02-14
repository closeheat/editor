var React, visualInject;

React = require('react');

window._ = require('lodash');

visualInject = function() {
  var NO_CONTENT_TAGS, bindEvents, calculateSelector, edit, editableNodeTypes, getElementOffset, getNode, getSelector, inTagWhitelist, isEditable, navigate, nodeFromPoint, onMessage, positionInDom, scrollToRecentPosition;
  window.CLOSEHEAT_EDITOR = {};
  NO_CONTENT_TAGS = ['INPUT', 'BUTTON', 'IMG'];
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
  getSelector = function(node, fallback_target) {
    if (node.nodeName === '#text') {
      return calculateSelector(fallback_target);
    } else {
      return calculateSelector(node);
    }
  };
  calculateSelector = function(el) {
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
  edit = function(e) {
    var node, selector;
    if (window.CLOSEHEAT_EDITOR.navigating) {
      return;
    }
    node = getNode(e);
    if (!isEditable(node)) {
      return;
    }
    e.stopPropagation();
    e.preventDefault();
    selector = getSelector(node, e.target);
    window.CLOSEHEAT_EDITOR.last_target = e.target;
    parent.postMessage({
      action: 'edit',
      selector: selector,
      top: e.clientX,
      left: e.clientY,
      height: e.target.offsetHeight,
      width: e.target.offsetWidth,
      old_outline: e.target.outline,
      pathname: window.location.pathname,
      text: node.nodeValue,
      scrollY: window.scrollY,
      scrollX: window.scrollX,
      url: window.location.href
    }, 'SERVER_URL_PLACEHOLDER');
    return false;
  };
  isEditable = function(node) {
    if (inTagWhitelist(node)) {
      return true;
    }
    if (node.nodeValue) {
      return true;
    }
    return false;
  };
  inTagWhitelist = function(node) {
    return NO_CONTENT_TAGS.indexOf(node.tagName) !== -1;
  };
  getNode = function(event) {
    return nodeFromPoint(event.clientX, event.clientY);
  };
  editableNodeTypes = function() {
    return NO_CONTENT_TAGS.concat('#text');
  };
  nodeFromPoint = function(x, y) {
    var el, i, j, n, nodes, r, rect, rects;
    el = document.elementFromPoint(x, y);
    nodes = el.childNodes;
    i = 0;
    while (n = nodes[i++]) {
      if (editableNodeTypes().indexOf(n.nodeName)) {
        r = document.createRange();
        r.selectNode(n);
        rects = r.getClientRects();
        j = 0;
        while (rect = rects[j++]) {
          if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
            return n;
          }
        }
      }
    }
    return el;
  };
  onMessage = function(e) {
    if (e.data.action === 'navigate') {
      return navigate();
    }
  };
  navigate = function() {
    window.CLOSEHEAT_EDITOR.navigating = true;
    window.CLOSEHEAT_EDITOR.last_target.click();
    return window.CLOSEHEAT_EDITOR.navigating = false;
  };
  bindEvents = function() {
    window.addEventListener('click', edit, true);
    return window.addEventListener('message', onMessage, false);
  };
  getElementOffset = function(element) {
    var box, de, left, top;
    de = document.documentElement;
    box = element.getBoundingClientRect();
    top = box.top + window.pageYOffset - de.clientTop;
    left = box.left + window.pageXOffset - de.clientLeft;
    return {
      top: top,
      left: left
    };
  };
  scrollToRecentPosition = function() {
    var scroll_x, scroll_y;
    scroll_x = SCROLL_X_PLACEHOLDER;
    scroll_y = SCROLL_Y_PLACEHOLDER;
    if (!(scroll_x > 0 || scroll_y > 0)) {
      return;
    }
    return window.scrollTo(scroll_x, scroll_y);
  };
  bindEvents();
  scrollToRecentPosition();
  return console.log('injected her');
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
  shouldComponentUpdate: function(next_props, next_state) {
    return false;
  },
  wrapEvalFunction: function(code) {
    return "evalFunction = " + code + "; evalFunction()";
  },
  injectionCode: function() {
    return visualInject.toString().replace(/SERVER_URL_PLACEHOLDER/g, window.EDITOR_URL).replace(/SCROLL_X_PLACEHOLDER/g, this.props.scroll_x).replace(/SCROLL_Y_PLACEHOLDER/g, this.props.scroll_y);
  },
  inject: function() {
    console.log('inkecting');
    return this.evalInIframe(this.injectionCode());
  },
  evalInIframe: function(code) {
    return this.iframe().contentWindow.postMessage(this.wrapEvalFunction(code), this.props.browser_url);
  },
  render: function() {
    return React.createElement("div", {
      "className": 'browser'
    }, React.createElement("iframe", {
      "ref": 'iframe',
      "id": 'browser',
      "name": 'browser-frame',
      "src": this.props.browser_url
    }));
  }
});
