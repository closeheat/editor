var $, Browser, CodeMode, Editor, Header, React, _, jade;

React = require('react/addons');

jade = require('jade-memory-fs');

_ = require('lodash');

$ = window.jQuery = window.$ = require('jquery');

Browser = require('./browser');

Editor = require('./editor');

Header = require('./header');

module.exports = CodeMode = React.createClass({
  getInitialState: function() {
    return {
      browser_content: this.indexHTML(),
      editor_content: this.rawIndex()
    };
  },
  indexFilename: function() {
    var e;
    try {
      fs.readFileSync('/index.jade');
      return '/index.jade';
    } catch (_error) {
      e = _error;
      return '/index.html';
    }
  },
  indexHTML: function() {
    var md;
    if (this.indexFilename() === '/index.html') {
      return this.rawIndex();
    }
    md = require('marked');
    jade.filters.md = md;
    return jade.renderFile(this.indexFilename());
  },
  rawIndex: function() {
    return fs.readFileSync(this.indexFilename()).toString();
  },
  editorChange: function(new_content) {
    this.setState({
      editor_content: new_content
    });
    if (new_content === this.state.editor_content) {
      return this.setState({
        loaded: true
      });
    }
  },
  render: function() {
    return React.createElement("div", null, React.createElement(Header, {
      "index_filename": this.indexFilename(),
      "editor_content": this.state.editor_content,
      "index_html": this.indexHTML(),
      "raw_index": this.rawIndex()
    }), React.createElement("div", {
      "className": 'row'
    }, React.createElement("div", {
      "className": 'col editor-col full m5'
    }, React.createElement("div", {
      "className": 'editor'
    }, React.createElement(Editor, {
      "value": this.state.editor_content,
      "onChange": this.editorChange,
      "index_filename": this.indexFilename()
    }))), React.createElement("div", {
      "className": 'col browser-col full m7'
    }, React.createElement(Browser, {
      "initial_content": this.state.browser_content,
      "base": this.props.base,
      "ref": 'browser'
    }))));
  }
});
