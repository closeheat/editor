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
    return this.refs.browser.refresh(this.indexHTML());
  },
  deploy: function() {
    var $;
    $ = require('jquery');
    return $.ajax({
      url: this.props.server + "/api/v1/editor/deploy",
      method: 'POST',
      dataType: 'json',
      data: {
        username: this.props.username,
        reponame: this.props.reponame,
        code: this.rawIndex()
      }
    }, function(err, resp) {
      debugger;
    });
  },
  editorChange: function(new_content) {
    return this.setState({
      editor_content: new_content
    });
  },
  render: function() {
    return React.createElement("main", null, React.createElement("div", {
      "className": 'row'
    }, React.createElement("div", {
      "className": 'col-md-5'
    }, React.createElement("div", {
      "className": 'editor'
    }, React.createElement(Editor, {
      "value": this.state.editor_content,
      "onChange": this.editorChange
    })), React.createElement("div", {
      "className": 'actions'
    }, React.createElement("button", {
      "onClick": this.update,
      "className": 'preview'
    }, "Preview"), React.createElement("button", {
      "onClick": this.deploy,
      "className": 'publish'
    }, "Publish"))), React.createElement("div", {
      "className": 'col-md-7'
    }, React.createElement(Browser, {
      "initial_content": this.state.browser_content,
      "base": this.props.base,
      "ref": 'browser'
    }))));
  }
});
