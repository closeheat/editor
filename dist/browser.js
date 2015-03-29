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
    result = result.replace(/href\=\"/, 'href="' + this.base());
    return result.replace(/src\=\"/, 'src="' + this.base());
  },
  base: function() {
    return 'http://testing-editor.closeheatapp.com/';
  },
  srcHtml: function() {
    return {
      __html: "<embed src='" + (this.src()) + "'>"
    };
  },
  render: function() {
    return React.createElement("div", {
      "dangerouslySetInnerHTML": this.srcHtml()
    });
  }
});
