var Filesystem, _;

_ = require('lodash');

module.exports = Filesystem = (function() {
  function Filesystem() {}

  Filesystem.create = function(files) {
    return window.fs = files;
  };

  Filesystem.ls = function(path) {
    if (!path) {
      return window.fs;
    }
    return _.select(window.fs, function(file) {
      return file.path.match(RegExp("^" + path));
    });
  };

  Filesystem.read = function(path) {
    var file_on_path;
    file_on_path = _.detect(this.ls(), function(file) {
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
      var name, relative_to_dir;
      relative_to_dir = file.path.replace(RegExp("^" + path + "\\/"), '');
      if (relative_to_dir.match('/')) {
        name = _.first(relative_to_dir.split('/'));
        return result.push({
          type: 'dir',
          path: name
        });
      } else {
        return result.push(_.merge(file, {
          type: 'file'
        }));
      }
    });
    return _.uniq(result, function(file) {
      return file.path;
    });
  };

  Filesystem.write = function(path, new_content) {
    var file;
    file = this.read(path);
    return file.content = new_content;
  };

  Filesystem.isFile = function(path) {
    return _.detect(this.ls(), function(file) {
      return file.path === path;
    });
  };

  return Filesystem;

})();
