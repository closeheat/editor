var Browser, React;

React = require('react');

module.exports = Browser = React.createClass({
  src: function() {
    return "data:text/html;charset=utf-8," + (encodeURIComponent(this.code()));
  },
  code: function(content) {
    return content.replace('<head>', "<head><base href='" + this.props.base + "'>");
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
