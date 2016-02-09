var Filesystem, FilesystemHistory, InitialLoader, Promise, _, request;

_ = require('lodash');

request = require('request');

Promise = require('bluebird');

Filesystem = require('./filesystem');

FilesystemHistory = require('./filesystem_history');

module.exports = InitialLoader = (function() {
  function InitialLoader() {}

  InitialLoader.prototype.loadFilesAndData = function() {
    return this.addFiles();
  };

  InitialLoader.prototype.addFiles = function() {
    return this.getInitialData().then((function(_this) {
      return function(data) {
        window.CloseheatFileSettings = {};
        FilesystemHistory.create();
        Filesystem.create(data.files);
        return data;
      };
    })(this))["catch"]((function(_this) {
      return function(err) {
        return alert(err);
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

  return InitialLoader;

})();
