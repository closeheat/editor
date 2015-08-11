var Browser, ContentEditable, React, inlineEditingInject;

React = require('react');

ContentEditable = require('react-wysiwyg');

window.$ = require('jquery');

inlineEditingInject = function() {
  var $, browser, noContentEditable, sendToEditor;
  sendToEditor = function(before, after) {
    return parent.CloseheatAppComponentInstance.inlineEdited(before, after);
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
  browser.on('focus', '[contenteditable]', function() {
    console.log('focus');
    return this.setAttribute('data-before', noContentEditable($(this)).prop('outerHTML'));
  });
  return browser.on('blur', '[contenteditable]', function() {
    console.log('bl');
    return sendToEditor($(this).data('before'), noContentEditable($(this)).prop('outerHTML'));
  });
};

module.exports = Browser = React.createClass({
  getInitialState: function() {
    window.CloseheatAppComponentInstance = this.props.app;
    return {};
  },
  code: function(content) {
    var result;
    result = content.replace('<head>', "<head><base href='" + this.props.base + "'>");
    return result.replace('</body>', "<script type='text/javascript'>inlineEditing = " + (inlineEditingInject.toString()) + "; inlineEditing()</script></body>");
  },
  refresh: function(content) {
    var doc;
    doc = document.getElementById('browser').contentWindow.document;
    doc.open();
    doc.write(this.code(content));
    return doc.close();
  },
  componentDidMount: function() {
    return this.refresh(this.props.initial_content);
  },
  render: function() {
    return React.createElement("div", {
      "className": 'browser'
    }, React.createElement("iframe", {
      "id": 'browser',
      "name": 'browser-frame'
    }));
  }
});
