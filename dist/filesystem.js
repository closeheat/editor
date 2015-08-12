var Filesystem, Promise, _, request;

_ = require('lodash');

request = require('request');

Promise = require('bluebird');

module.exports = Filesystem = (function() {
  function Filesystem() {
    require('jade-memory-fs');
  }

  Filesystem.prototype.files = function() {
    return fs.data();
  };

  Filesystem.prototype.load = function() {
    return this.addFiles();
  };

  Filesystem.prototype.addFiles = function() {
    return this.getFiles().then((function(_this) {
      return function(files) {
        var compatible_files;
        _this.createDirs(files);
        compatible_files = _.select(files, function(file) {
          return file.path.match(/\.jade|md|html$/);
        });
        return Promise.all(_this.addFileContents(compatible_files));
      };
    })(this));
  };

  Filesystem.prototype.createDirs = function(files) {
    var files_in_dirs;
    files_in_dirs = _.select(files, function(file) {
      var file_dir_split;
      file_dir_split = file.path.split('/');
      return file_dir_split.length > 1;
    });
    return _.each(files_in_dirs, function(file) {
      var dir_path, file_dir_split;
      file_dir_split = file.path.split('/');
      dir_path = _.initial(file_dir_split).join('/');
      return fs.mkdirpSync("/" + dir_path);
    });
  };

  Filesystem.prototype.getFiles = function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return request.post({
          url: window.location.origin + "/apps/" + APP_SLUG + "/live_edit/initial"
        }, function(err, status, resp) {
          var files;
          if (err) {
            return reject(err);
          }
          files = JSON.parse(resp).files;
          return resolve(files);
        });
      };
    })(this));
  };

  Filesystem.prototype.addFileContents = function(files) {
    var result;
    result = [];
    _.each(files, (function(_this) {
      return function(file) {
        var promise;
        promise = new Promise(function(resolve, reject) {
          fs.writeFileSync("/" + file.path, file.content);
          return resolve();
        });
        return result.push(promise);
      };
    })(this));
    return result;
  };

  return Filesystem;

})();
