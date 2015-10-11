var Promise, React, request;

React = require('react/addons');

Promise = require('bluebird');

request = require('request');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      commit_msg: ''
    };
  },
  changeCommitMsg: function(e) {},
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
    }, React.createElement("textarea", {
      "className": 'materialize-textarea',
      "id": 'commit-msg',
      "type": 'text',
      "value": this.state.commit_msg,
      "onChange": this.changeCommitMsg
    }), React.createElement("label", {
      "htmlFor": 'commit-msg',
      "className": 'active'
    }, "Change comment (commit message)")), React.createElement("div", {
      "className": 'branch-options'
    }, React.createElement("div", null, React.createElement("input", {
      "type": 'radio',
      "id": 'branch-master'
    }), React.createElement("label", {
      "htmlFor": 'branch-master'
    }, "Deploy to website (master branch)")), React.createElement("div", null, React.createElement("input", {
      "type": 'radio',
      "id": 'branch-pr'
    }), React.createElement("label", {
      "htmlFor": 'branch-pr'
    }, "Create a Pull Request with changes (create new branch)")), React.createElement("div", {
      "className": 'input-field'
    }, React.createElement("input", {
      "id": 'dist-dir',
      "type": 'text'
    }), React.createElement("label", {
      "htmlFor": 'dist-dir',
      "className": 'active'
    }, "Title for a Pull Request"))), React.createElement("div", {
      "className": "btn btn-large waves-effect waves-light settings-save-changes-button"
    }, "Publish"))));
  }
});
