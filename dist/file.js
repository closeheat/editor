var Navigation, React, Router;

React = require('react');

Router = require('react-router');

Navigation = Router.Navigation;

module.exports = React.createClass({
  mixins: [Navigation],
  activeClass: function() {
    var result;
    result = 'tab col m2';
    if (this.props.active) {
      result += ' tab-active';
    }
    return result;
  },
  onClick: function() {
    if (this.uneditableFile()) {
      return;
    }
    return this.transitionTo('file', {
      splat: this.props.file.href
    });
  },
  kind: function() {
    var ext;
    if (this.props.file.type === 'dir') {
      return 'Folder';
    }
    ext = this.props.file.path.match(/\.([0-9a-z]+)$/i)[1];
    return this.props.supported_modes[ext] || ext;
  },
  icon: function() {
    if (this.props.file.type === 'dir') {
      return React.createElement("i", {
        "className": 'material-icons'
      }, "folder_open");
    } else {
      return React.createElement("i", {
        "className": 'material-icons'
      }, "class");
    }
  },
  uneditableFile: function() {
    return this.props.file.type === 'file' && !this.props.file.editable;
  },
  editableClass: function() {
    if (this.uneditableFile()) {
      return 'file-list-uneditable';
    }
  },
  render: function() {
    return React.createElement("tr", {
      "onClick": this.onClick,
      "className": this.editableClass()
    }, React.createElement("td", {
      "className": 'file-list-icon'
    }, this.icon()), React.createElement("td", {
      "className": 'file-list-name'
    }, this.props.file.name), React.createElement("td", {
      "className": 'file-list-kind'
    }, this.kind()));
  }
});
