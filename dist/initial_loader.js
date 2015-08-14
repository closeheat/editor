var Filesystem, InitialLoader, Promise, _, request;

_ = require('lodash');

request = require('request');

Promise = require('bluebird');

Filesystem = require('./filesystem');

module.exports = InitialLoader = (function() {
  function InitialLoader() {
    Filesystem.create();
  }

  InitialLoader.prototype.loadFilesAndData = function() {
    return this.addFiles();
  };

  InitialLoader.prototype.addFiles = function() {
    return this.getInitialData().then((function(_this) {
      return function(data) {
        Filesystem.createDirs(data.files);
        return Promise.all(_this.addFileContents(data.files)).then(function() {
          return data;
        });
      };
    })(this));
  };

  InitialLoader.prototype.getInitialData = function() {
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

  InitialLoader.prototype.addFileContents = function(files) {
    return _.each(files, (function(_this) {
      return function(file) {
        return Filesystem.write(file);
      };
    })(this));
  };

  return InitialLoader;

})();
