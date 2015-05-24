var App, Browser, Button, Editor, InfoModal, Modal, OverlayMixin, React, ReactBootstrap, Tour, _, jade;

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

Tour = React.createClass({
  step1: function() {
    return React.createElement("div", {
      "className": 'tooltip-left tour-code-editor'
    }, "Change the code here");
  },
  step2: function() {
    return React.createElement("div", {
      "className": 'tooltip-left tour-preview-button'
    }, "Click \"Preview\" to see your changes in the browser");
  },
  step3: function() {
    return React.createElement("div", {
      "className": 'tooltip-left tour-deploy-button'
    }, "Click \"Publish\" to make your changes available to website visitors");
  },
  render: function() {
    var step;
    step = this['step' + this.props.step];
    return step && step();
  }
});

module.exports = App = React.createClass({
  getInitialState: function() {
    return {
      browser_content: this.indexHTML(),
      editor_content: this.rawIndex(),
      tour_step: 1
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
  update: function() {
    fs.writeFileSync(this.indexFilename(), this.state.editor_content);
    this.refs.browser.refresh(this.indexHTML());
    return this.setState({
      tour_step: 3
    });
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
    this.setState({
      tour_step: 4
    });
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
        code: this.rawIndex(),
        index_filename: this.indexFilename()
      }
    }).then(this.showSuccess).fail(this.showError);
  },
  editorChange: function(new_content) {
    this.setState({
      editor_content: new_content
    });
    if (this.state.loaded) {
      this.setState({
        tour_step: 2
      });
    }
    if (new_content === this.state.editor_content) {
      return this.setState({
        loaded: true
      });
    }
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
      "onChange": this.editorChange,
      "index_filename": this.indexFilename()
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
    }))), React.createElement(Tour, {
      "step": this.state.tour_step
    }));
  }
});
