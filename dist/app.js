var App, Browser, Button, Editor, InfoModal, Modal, OverlayMixin, React, ReactBootstrap, _, jade;

React = require('react');

jade = require('jade-memory-fs');

_ = require('lodash');

ReactBootstrap = require('react-bootstrap');

Modal = ReactBootstrap.Modal;

Button = ReactBootstrap.Button;

OverlayMixin = ReactBootstrap.OverlayMixin;

Browser = require('./browser');

Editor = require('./editor');

InfoModal = React.createClass({
  mixins: [OverlayMixin],
  render: function() {
    return React.createElement("span", null);
  },
  renderOverlay: function() {
    if (!this.props.open) {
      return React.createElement("span", null);
    }
    return React.createElement(Modal, {
      "bsStyle": 'primary',
      "title": this.props.title,
      "onRequestHide": this.props.close
    }, React.createElement("div", {
      "className": 'modal-footer'
    }, React.createElement(Button, {
      "onClick": this.props.close
    }, "Close")));
  }
});

module.exports = App = React.createClass({
  getInitialState: function() {
    return {
      browser_content: this.indexHTML(),
      editor_content: this.rawIndex()
    };
  },
  indexHTML: function() {
    var md;
    md = require('marked');
    jade.filters.md = md;
    return jade.renderFile('/index.jade');
  },
  rawIndex: function() {
    return fs.readFileSync('/index.jade').toString();
  },
  update: function() {
    fs.writeFileSync('/index.jade', this.state.editor_content);
    return this.refs.browser.refresh(this.indexHTML());
  },
  showError: function() {
    return this.setState({
      modal_open: true
    });
  },
  showSuccess: function() {
    return this.setState({
      modal_title: 'Successfully deployed!'
    });
  },
  closeModal: function() {
    return this.setState({
      modal_open: false
    });
  },
  deploy: function() {
    var $;
    $ = require('jquery');
    this.setState({
      modal_open: true,
      modal_title: 'Take a deep breath...'
    });
    return $.ajax({
      url: SERVER_URL + "/apps/" + APP_SLUG + "/live_deploy",
      method: 'POST',
      dataType: 'json',
      data: {
        username: this.props.username,
        reponame: this.props.reponame,
        code: this.rawIndex()
      }
    }).then(this.showSuccess).fail(this.showError);
  },
  editorChange: function(new_content) {
    return this.setState({
      editor_content: new_content
    });
  },
  render: function() {
    return React.createElement("main", null, React.createElement(InfoModal, {
      "open": this.state.modal_open,
      "title": this.state.modal_title,
      "close": this.closeModal
    }), React.createElement("div", {
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
