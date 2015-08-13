var React, _;

React = require('react/addons');

_ = require('lodash');

module.exports = React.createClass({
  folderFiles: function() {
    var result;
    result = _.map(fs.data[this.props.path], (function(_this) {
      return function(location, path) {
        return {
          type: _this.locationType(location),
          path: path
        };
      };
    })(this));
    return _.reject(result, function(file) {
      return file.type === 'folder-marker';
    });
  },
  locationType: function(location) {
    if (_.isObject(location)) {
      return 'folder';
    } else if (location === true) {
      return 'folder-marker';
    } else {
      return 'file';
    }
  },
  render: function() {
    return React.createElement("div", null, React.createElement("div", {
      "className": 'row'
    }, React.createElement("div", {
      "className": 'col editor-col full m12'
    }, React.createElement("div", {
      "className": 'editor'
    }, React.createElement("ul", null, _.map(this.folderFiles(), function(file) {
      return React.createElement("li", null, file.type, " - ", file.path);
    }))))));
  }
});
