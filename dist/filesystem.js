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
    return this.getInitialData().then((function(_this) {
      return function(data) {
        _this.createDirs(data.files);
        return Promise.all(_this.addFileContents(data.files)).then(function() {
          return data;
        });
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

  Filesystem.prototype.getInitialData = function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return request.get({
          json: true,
          url: window.location.origin + "/apps/" + APP_SLUG + "/live_edit/init"
        }, function(err, status, resp) {
          if (err) {
            return reject(err);
          }
          return resolve(resp);
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
          fs.writeFileSync(fs.join('/', file.path), file.content || 'not-modifiable');
          return resolve();
        });
        return result.push(promise);
      };
    })(this));
    return result;
  };

  return Filesystem;

})();
