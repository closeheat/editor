var App, Browser, Editor, React, _, jade;

React = require('react');

jade = require('jade-memory-fs');

_ = require('lodash');

Browser = require('./browser');

Editor = require('./editor');

module.exports = App = React.createClass({
  getInitialState: function() {
    return {
      browser_content: this.indexHTML(),
      editor_content: this.rawIndex()
    };
  },
  indexHTML: function() {
    return jade.renderFile('/index.jade');
  },
  rawIndex: function() {
    return fs.readFileSync('/index.jade').toString();
  },
  update: function() {
    fs.writeFileSync('/index.jade', this.state.editor_content);
    return this.setState({
      browser_content: this.indexHTML()
    });
  },
  editorChange: function(new_content) {
    return this.setState({
      editor_content: new_content
    });
  },
  render: function() {
    return React.createElement("div", {
      "className": 'container'
    }, React.createElement("div", {
      "className": 'row'
    }, React.createElement(Browser, {
      "content": this.state.browser_content,
      "base": this.props.base,
      "ref": 'browser'
    }), React.createElement(Editor, {
      "value": this.state.editor_content,
      "onChange": this.editorChange
    }), React.createElement("button", {
      "onClick": this.update
    }, "Build")));
  }
});
