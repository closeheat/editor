var FilesystemHistory, _;

_ = require('lodash');

module.exports = FilesystemHistory = (function() {
  function FilesystemHistory() {}

  FilesystemHistory.create = function() {
    return window.fs_history = [];
  };

  FilesystemHistory.write = function(file) {
    return window.fs_history.push(_.cloneDeep(file));
  };

  FilesystemHistory.last = function() {
    return _.last(window.fs_history);
  };

  return FilesystemHistory;

})();
