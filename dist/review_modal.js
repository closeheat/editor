var Filesystem, FilesystemHistory, React, ReactDOM, _, classNames, jsdiff;

_ = require('lodash');

React = require('react');

ReactDOM = require('react-dom');

jsdiff = require('diff');

classNames = require('classnames');

Filesystem = require('./filesystem');

FilesystemHistory = require('./filesystem_history');

module.exports = React.createClass({
  diff: function() {
    return jsdiff.diffLines(FilesystemHistory.last().content, Filesystem.read(this.props.file_path).content);
  },
  lineClass: function(line) {
    return classNames({
      'review-diff-line': true,
      'review-diff-line-added': line.added,
      'review-diff-line-removed': line.removed
    });
  },
  noDiff: function() {
    return React.createElement("div", {
      "className": 'review-no-diff'
    }, "There we\'re no differences. Weird.");
  },
  lines: function() {
    if (!this.diff().length) {
      return this.noDiff();
    }
    return React.createElement("pre", {
      "className": 'review-modal-code'
    }, _.map(this.diff(), (function(_this) {
      return function(line, i) {
        return React.createElement("div", {
          "key": i,
          "className": _this.lineClass(line)
        }, line.value);
      };
    })(this)));
  },
  componentDidUpdate: function() {
    var el;
    el = $(ReactDOM.findDOMNode(this));
    if (this.props.show) {
      el.openModal();
      return el.find('.modal-content').scrollTo('.review-diff-line-added, .review-diff-line-removed');
    } else {
      return el.closeModal();
    }
  },
  render: function() {
    if (!this.props.show) {
      return React.createElement("noscript", null);
    }
    return React.createElement("div", {
      "id": "modal1",
      "className": "modal modal-fixed-footer review-modal"
    }, React.createElement("div", {
      "className": "modal-content"
    }, this.lines()), React.createElement("div", {
      "className": "modal-footer"
    }, React.createElement("span", {
      "className": 'review-modal-file-path'
    }, this.props.file_path), React.createElement("button", {
      "onClick": this.props.onUndo,
      "className": "modal-action modal-close waves-effect red-text waves-red btn-flat "
    }, "Undo changes"), React.createElement("button", {
      "onClick": this.props.onClose,
      "className": "modal-action modal-close waves-effect green-text waves-green btn-flat "
    }, "Looks good")));
  }
});
