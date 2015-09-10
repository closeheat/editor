var Promise, React, request;

React = require('react/addons');

Promise = require('bluebird');

request = require('request');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      dist_dir: this.props.dist_dir,
      slug: this.props.slug
    };
  },
  changeDistDir: function(e) {
    return this.setState({
      dist_dir: e.target.value
    });
  },
  changeSlug: function(e) {
    return this.setState({
      slug: e.target.value
    });
  },
  render: function() {
    return React.createElement("div", {
      "className": 'settings'
    }, React.createElement("div", {
      "className": 'row'
    }, React.createElement("div", {
      "className": 'settings-container col offset-s4 s4 offset-m3 m6 offset-l4 l4'
    }, React.createElement("div", {
      "className": 'row'
    }, React.createElement("div", {
      "className": 'settings-title'
    }, "Website Settings")), React.createElement("div", {
      "className": 'row'
    }, React.createElement("div", {
      "className": 'input-field settings-slug'
    }, React.createElement("input", {
      "id": 'dist-dir',
      "type": 'text',
      "value": this.state.slug,
      "onChange": this.changeSlug
    }), React.createElement("label", {
      "htmlFor": 'dist-dir',
      "className": 'active'
    }, "Subdomain")), React.createElement("span", {
      "className": 'settings-slug'
    }, ".closeheatapp.com")), React.createElement("div", {
      "className": 'input-field'
    }, React.createElement("input", {
      "id": 'dist-dir',
      "type": 'text',
      "value": this.state.dist_dir,
      "onChange": this.changeDistDir
    }), React.createElement("label", {
      "htmlFor": 'dist-dir',
      "className": 'active'
    }, "Directory to be published")), React.createElement("div", {
      "className": "btn btn-large waves-effect waves-light settings-save-changes-button"
    }, "Save Changes"))));
  }
});
