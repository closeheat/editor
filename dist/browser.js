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
    var document;
    document = frames['browser-frame'].document;
    document.open();
    return document.write(this.code(content));
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
