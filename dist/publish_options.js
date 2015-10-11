var BranchOptions, Promise, React, request;

React = require('react/addons');

Promise = require('bluebird');

request = require('request');

BranchOptions = require('./branch_options');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      commit_msg: '',
      branch: 'master',
      title: ''
    };
  },
  componentDidMount: function() {
    return track('publish_options');
  },
  check: function(type) {
    return this.setState({
      branch: type
    });
  },
  titleChange: function(new_title) {
    return this.setState({
      title: new_title
    });
  },
  changeCommitMsg: function(e) {
    return this.setState({
      commit_msg: e.target.value
    });
  },
  "continue": function() {
    return this.props.onContinue(this.state);
  },
  render: function() {
    return React.createElement("div", {
      "className": 'publish-options settings'
    }, React.createElement("div", {
      "className": 'row'
    }, React.createElement("div", {
      "className": 'settings-container col s12 offset-m2 m8 offset-l3 l6'
    }, React.createElement("div", {
      "className": 'row'
    }, React.createElement("div", {
      "className": 'settings-title'
    }, "Publish changes")), React.createElement("div", {
      "className": 'input-field'
    }, React.createElement("input", {
      "id": 'commit-msg',
      "type": 'text',
      "value": this.state.commit_msg,
      "onChange": this.changeCommitMsg
    }), React.createElement("label", {
      "htmlFor": 'commit-msg'
    }, "Comment")), React.createElement(BranchOptions, {
      "branch": this.state.branch,
      "onCheck": this.check,
      "title": this.state.title,
      "onTitleChange": this.titleChange
    }), React.createElement("div", {
      "onClick": this["continue"],
      "className": "btn btn-large waves-effect waves-light settings-save-changes-button"
    }, "Continue"))));
  }
});
