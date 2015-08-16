var React, inlineInject;

React = require('react');

inlineInject = function() {
  var $, browser, noContentEditable, sendToEditor;
  sendToEditor = function(before, after) {
    return parent.closeheatInlineOnChange.inlineEdited(before, after);
  };
  noContentEditable = function(target) {
    var result;
    result = target.clone();
    result.removeAttr('contenteditable');
    result.removeAttr('data-before');
    return result;
  };
  $ = parent.$;
  browser = $(window.document);
  browser.find('h1').prop('contentEditable', true);
  debugger;
  browser.on('click', function() {
    return console.log('aa');
  });
  browser.on('focus', '[contenteditable]', function() {
    console.log('focus');
    return this.setAttribute('data-before', noContentEditable($(this)).prop('outerHTML'));
  });
  return browser.on('blur', '[contenteditable]', function() {
    console.log('bl');
    return sendToEditor($(this).data('before'), noContentEditable($(this)).prop('outerHTML'));
  });
};

module.exports = React.createClass({
  getInitialState: function() {
    window.closeheatInlineOnChange = this.props.onChange;
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
  inject: function() {
    return this.iframe().contentWindow["eval"]("inlineInject = " + (inlineInject.toString()) + "; inlineInject()");
  },
  render: function() {
    return React.createElement("div", {
      "className": 'browser'
    }, React.createElement("iframe", {
      "id": 'browser',
      "name": 'browser-frame',
      "src": 'http://editor.d44ff2f8e27ece72d5034da1ea78ceb3129b5452.demo-d855.staging.closeheat.com' || this.props.browser_url
    }));
  }
});
