var Filesystem, FilesystemHistory, _;

_ = require('lodash');

FilesystemHistory = require('./filesystem_history');

module.exports = Filesystem = (function() {
  function Filesystem() {}

  Filesystem.create = function(files) {
    return window.fs = files;
  };

  Filesystem.ls = function(path) {
    if (!path) {
      return window.fs;
    }
    return _.filter(window.fs, function(file) {
      return file.path.match(RegExp("^" + path));
    });
  };

  Filesystem.read = function(path) {
    var file_on_path;
    file_on_path = _.find(this.ls(), function(file) {
      return file.path === path;
    });
    if (file_on_path) {
      return file_on_path;
    }
    return {
      type: 'dir',
      path: path,
      files: this.dirFiles(path)
    };
  };

  Filesystem.dirFiles = function(path) {
    var result;
    result = [];
    _.each(this.ls(path), function(file) {
      var dir_path, name, relative_to_dir;
      relative_to_dir = file.path.replace(RegExp("^" + path + "\\/"), '');
      name = _.first(relative_to_dir.split('/'));
      if (relative_to_dir.match('/')) {
        dir_path = _.isEmpty(path) ? name : [path, name].join('/');
        return result.push({
          type: 'dir',
          path: dir_path,
          name: name
        });
      } else {
        return result.push(_.merge(file, {
          type: 'file',
          name: name
        }));
      }
    });
    return _.uniqBy(result, 'name');
  };

  Filesystem.write = function(path, new_content) {
    var file;
    file = this.read(path);
    FilesystemHistory.write(file);
    return file.content = new_content;
  };

  Filesystem.isFile = function(path) {
    return _.find(this.ls(), function(file) {
      return file.path === path;
    });
  };

  return Filesystem;

})();
