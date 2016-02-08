var File, FileUp, Filesystem, Link, React, Router, _;

React = require('react');

_ = require('lodash');

Router = require('react-router');

Link = Router.Link;

Filesystem = require('./filesystem');

File = require('./file');

FileUp = require('./file_up');

module.exports = React.createClass({
  folderFiles: function() {
    var dirs, files, ref, result;
    result = _.map(this.props.dir.files, (function(_this) {
      return function(file) {
        file.href = _this.props.reuseTabHref(file.path);
        return file;
      };
    })(this));
    ref = _.partition(result, function(f) {
      return f.type === 'dir';
    }), dirs = ref[0], files = ref[1];
    return dirs.concat(files);
  },
  upHref: function() {
    var up_path;
    up_path = _.dropRight(this.pathParts());
    return this.props.reuseTabHref(up_path);
  },
  pathParts: function() {
    return (this.props.path || '').split('/');
  },
  render: function() {
    return React.createElement("div", null, React.createElement("div", {
      "className": 'row'
    }, React.createElement("div", {
      "className": 'col m12'
    }, React.createElement("ul", {
      "className": 'file-list-path'
    }, React.createElement("li", {
      "className": 'file-list-start'
    }, "Files"), _.map(this.pathParts(), function(part) {
      return React.createElement("li", {
        "key": part
      }, React.createElement("span", {
        "className": 'file-list-sep'
      }, "\x2F"), React.createElement("span", {
        "className": 'file-list-name'
      }, part));
    })), React.createElement("table", {
      "className": 'file-list'
    }, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("th", {
      "colSpan": 2
    }, "Name"), React.createElement("th", null, "Kind")), React.createElement(FileUp, {
      "show": !!this.props.path,
      "href": this.upHref()
    }), _.map(this.folderFiles(), (function(_this) {
      return function(file) {
        return React.createElement(File, {
          "key": file.path,
          "file": file,
          "active": _this.props.active,
          "supported_modes": _this.props.supported_modes
        });
      };
    })(this)))))));
  }
});
