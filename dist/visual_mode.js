var AfterApplyToast, Filesystem, FilesystemHistory, Loader, Prompt, React, ReviewModal, SourceFinder, SourceModifier, VisualBrowser, _;

React = require('react');

_ = require('lodash');

VisualBrowser = require('./visual_browser');

Prompt = require('./prompt');

Loader = require('./loader');

Filesystem = require('./filesystem');

FilesystemHistory = require('./filesystem_history');

SourceFinder = require('./source_finder');

SourceModifier = require('./source_modifier');

AfterApplyToast = require('./after_apply_toast');

ReviewModal = require('./review_modal');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      build_finished: false,
      show_prompt: false,
      show_review: false,
      show_after_apply_toast: false,
      iframe_scroll_top: 0,
      iframe_scroll_left: 0,
      current_element_data: {},
      last_element_data: {}
    };
  },
  componentDidMount: function() {
    Materialize.toast("Click on any text to change it.", 4000);
    return this.build();
  },
  build: function() {
    return this.props.build().then((function(_this) {
      return function(resp) {
        return _this.setState({
          build_finished: true
        });
      };
    })(this))["catch"]((function(_this) {
      return function(err) {
        return _this.props.handleError(err);
      };
    })(this));
  },
  rebuild: function() {
    this.setState({
      build_finished: false
    });
    return this.build();
  },
  onMessage: function(e) {
    if (e.data.action === 'edit') {
      return this.onEdit(e.data);
    }
  },
  onEdit: function(event) {
    var element_data;
    element_data = this.editableElement(event);
    return this.setState({
      show_prompt: true,
      show_after_apply_toast: false,
      current_element_data: element_data,
      last_element_data: {}
    });
  },
  removePrompt: function() {
    return this.setState({
      show_prompt: false
    });
  },
  editableElement: function(event) {
    var final;
    final = new SourceFinder(event, this.editableFiles()).source();
    console.log(final);
    return final;
  },
  isEditableElement: function(locations) {
    var element;
    if (locations.length !== 1) {
      return;
    }
    element = locations[0].element;
    if (element.children().length !== 0) {
      return;
    }
    if (!element.html()) {
      return;
    }
    return true;
  },
  editableFiles: function() {
    return _.filter(Filesystem.ls(), 'editable');
  },
  onScroll: function(data) {
    return this.setState({
      iframe_scroll_top: data.top,
      iframe_scroll_left: data.left
    });
  },
  onApply: function(new_text) {
    new SourceModifier(this.state.current_element_data, new_text).apply();
    this.setState({
      current_element_data: {},
      last_element_data: this.state.current_element_data,
      show_after_apply_toast: true
    });
    this.removePrompt();
    return this.rebuild();
  },
  onNavigate: function() {
    this.refs.browser.refs.iframe.contentWindow.postMessage({
      action: 'navigate'
    }, '*');
    return this.removePrompt();
  },
  removeAfterApplyToast: function() {
    return this.setState({
      show_after_apply_toast: true
    });
  },
  reviewApplied: function() {
    console.log('review');
    clearTimeout(this.after_apply_timer_id);
    return this.setState({
      show_review: true,
      show_after_apply_toast: false
    });
  },
  undoApplied: function() {
    var last_change;
    clearTimeout(this.after_apply_timer_id);
    last_change = FilesystemHistory.last();
    Filesystem.write(last_change.path, last_change.content);
    return this.rebuild();
  },
  afterApplyToast: function() {
    if (!this.state.show_after_apply_toast) {
      return React.createElement("div", null);
    }
    return React.createElement(AfterApplyToast, {
      "file_path": this.state.last_element_data.file_path,
      "onUndo": this.undoApplied,
      "onReview": this.reviewApplied,
      "onClose": this.removeAfterApplyToast
    });
  },
  hideReview: function() {
    return this.setState({
      show_review: false
    });
  },
  browser: function() {
    return React.createElement("div", null, React.createElement(ReviewModal, {
      "show": this.state.show_review,
      "onUndo": this.undoApplied,
      "onClose": this.hideReview,
      "file_path": this.state.last_element_data.file_path
    }), React.createElement("div", {
      "className": 'row'
    }, React.createElement("div", {
      "className": 'col browser-col full m12'
    }, React.createElement(VisualBrowser, {
      "ref": 'browser',
      "browser_url": this.props.browser_url,
      "onMessage": this.onMessage
    }))), this.state.show_prompt && React.createElement(Prompt, {
      "element_data": this.state.current_element_data,
      "onApply": this.onApply,
      "onClose": this.removePrompt,
      "onNavigate": this.onNavigate
    }), this.afterApplyToast());
  },
  render: function() {
    if (this.state.build_finished) {
      return this.browser();
    } else {
      return React.createElement(Loader, {
        "title": 'Hang in tight. Building your page...'
      });
    }
  }
});
