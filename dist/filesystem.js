var Filesystem, _, traverse;

_ = require('lodash');

traverse = require('traverse');

module.exports = Filesystem = (function() {
  function Filesystem() {}

  Filesystem.create = function() {
    return window.fs = {};
  };

  Filesystem.createDirs = function(files) {
    var files_in_dirs;
    files_in_dirs = _.select(files, function(file) {
      var file_dir_split;
      file_dir_split = file.path.split('/');
      return file_dir_split.length > 1;
    });
    return _.each(files_in_dirs, (function(_this) {
      return function(file) {
        var dir_path, file_dir_split;
        file_dir_split = file.path.split('/');
        dir_path = _.initial(file_dir_split).join('/');
        return _this.createDir(dir_path);
      };
    })(this));
  };

  Filesystem.createDir = function(dir_path) {
    if (!fs[dir_path]) {
      return fs[dir_path] = {};
    }
  };

  Filesystem.write = function(file) {
    var dir;
    dir = this.readDir(file.path);
    return dir[this.filename(file.path)] = file;
  };

  Filesystem.readDir = function(path) {
    if (this.dirnameKey(path) === '') {
      return fs;
    }
    return _.get(fs, this.dirnameKey(path));
  };

  Filesystem.filename = function(path) {
    var path_parts;
    path_parts = path.split('/');
    return _.last(path_parts);
  };

  Filesystem.dirnameKey = function(path) {
    var path_parts;
    path_parts = path.split('/');
    return path_parts.slice(0, -1).join('.');
  };

  Filesystem.ls = function() {
    var result;
    result = [];
    return traverse(fs).map(function(node) {
      if (_.isString(node.path)) {
        return result.push(node);
      }
    });
  };

  return Filesystem;

})();
