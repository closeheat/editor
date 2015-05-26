var App, Browser, Editor, InfoModal, React, Tour, _, jade;

React = require('react');

jade = require('jade-memory-fs');

_ = require('lodash');

Browser = require('./browser');

Editor = require('./editor');

InfoModal = React.createClass({
  render: function() {
    if (this.props.open) {
      return React.createElement("div", {
        "className": 'modal'
      }, React.createElement("div", {
        "className": 'fog'
      }), React.createElement("div", {
        "className": 'loading'
      }, "Loading"));
    } else {
      return React.createElement("span", null);
    }
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
    if (step && !this.props.done) {
      return step();
    } else {
      return React.createElement("div", null);
    }
  }
});

module.exports = App = React.createClass({
  getInitialState: function() {
    return {
      browser_content: this.indexHTML(),
      editor_content: this.rawIndex(),
      status: 'none',
      tour_step: 1
    };
  },
  noStep: function() {
    return this.setState({
      tour_step: 1000
    });
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
    if (this.state.loaded) {
      return this.setState({
        tour_step: 3
      });
    }
  },
  showError: function() {
    return this.setState({
      status: 'error'
    });
  },
  showSuccess: function() {
    return this.setState({
      status: 'published'
    });
  },
  deploy: function() {
    var $;
    this.setState({
      tour_done: true
    });
    $ = require('jquery');
    this.setState({
      status: 'publishing'
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
  publishing: function() {
    if (this.state.status === 'publishing') {
      return React.createElement("div", {
        "className": 'editor-modal'
      }, React.createElement("div", {
        "className": 'fog'
      }), React.createElement("div", {
        "className": 'publishing'
      }, "Publishing..."));
    }
  },
  published: function() {
    if (this.state.status === 'published') {
      return React.createElement("div", {
        "className": 'editor-modal'
      }, React.createElement("div", {
        "className": 'fog',
        "onClick": this.closeModal
      }), React.createElement("div", {
        "className": 'published'
      }, React.createElement("h3", null, "Your edits are published."), React.createElement("a", {
        "href": 'http://' + APP_SLUG + '.closeheatapp.com'
      }, "Open your website"), React.createElement("button", {
        "className": 'back',
        "onClick": this.closeModal
      }, "Back to editor")));
    }
  },
  closeModal: function() {
    return this.setState({
      status: 'none'
    });
  },
  render: function() {
    return React.createElement("main", null, this.publishing(), this.published(), React.createElement("div", {
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
      "step": this.state.tour_step,
      "done": this.state.tour_done
    }));
  }
});
