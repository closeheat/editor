var Filesystem, Github, _;

_ = require('lodash');

Github = require('github-api');

module.exports = Filesystem = (function() {
  function Filesystem(token, username, reponame) {
    this.token = token;
    this.username = username;
    this.reponame = reponame;
    require('jade-memory-fs');
  }

  Filesystem.prototype.files = function() {
    return fs.data();
  };

  Filesystem.prototype.load = function() {
    return this.addGithub();
  };

  Filesystem.prototype.github = function() {
    return new Github({
      token: this.token,
      auth: 'oauth'
    });
  };

  Filesystem.prototype.addGithub = function() {
    return this.getGithub().then((function(_this) {
      return function(objs) {
        var dirs, files;
        dirs = _.select(objs, function(file) {
          return file.type === 'tree';
        });
        _.each(dirs, function(dir) {
          return fs.mkdirpSync("/" + dir.path);
        });
        files = _.select(objs, function(obj) {
          return obj.path.match(/\.jade|md$/) && obj.type === 'blob';
        });
        return Promise.all(_this.addFileContents(files));
      };
    })(this));
  };

  Filesystem.prototype.getGithub = function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return _this.repo().getTree('master?recursive=true', function(err, contents) {
          if (err) {
            return reject(err);
          }
          return resolve(contents);
        });
      };
    })(this));
  };

  Filesystem.prototype.repo = function() {
    return this.github().getRepo(this.username, this.reponame);
  };

  Filesystem.prototype.addFileContents = function(files) {
    var result;
    result = [];
    _.each(files, (function(_this) {
      return function(file) {
        var promise;
        promise = new Promise(function(resolve, reject) {
          return _this.repo().read('master', file.path, function(err, contents) {
            if (err) {
              return reject(err);
            }
            fs.writeFileSync("/" + file.path, contents);
            return resolve();
          });
        });
        return result.push(promise);
      };
    })(this));
    return result;
  };

  return Filesystem;

})();
