var $, Browser, React;

React = require('react');

$ = require('jquery');

module.exports = Browser = React.createClass({
  src: function() {
    return "data:text/html;charset=utf-8," + (encodeURIComponent(this.code()));
  },
  code: function() {
    return this.appendBase(this.props.content);
  },
  appendBase: function(content) {
    var result;
    result = content;
    result = result.replace(/href\=\"(?!http:\/\/)(?!https:\/\/)/g, 'href="' + this.props.base);
    return result.replace(/src\=\"(?!http:\/\/)(?!https:\/\/)/g, 'src="' + this.props.base);
  },
  componentDidMount: function() {
    var document;
    document = frames['browser-frame'].document;
    return document.write(this.code());
  },
  componentDidUpdate: function() {
    var document;
    console.log('new code');
    console.log(this.code());
    document = frames['browser-frame'].document;
    return document.write(this.code());
  },
  render: function() {
    return React.createElement("div", {
      "className": 'col-xs-6 col-md-6 browser'
    }, React.createElement("iframe", {
      "id": 'browser',
      "name": 'browser-frame'
    }));
  }
});
