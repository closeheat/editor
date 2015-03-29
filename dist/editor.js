var $, Editor, Github, Promise, _, jade;

Promise = require('bluebird');

Github = require('github-api');

_ = require('lodash');

$ = require('jquery');

jade = require('jade-memory-fs');

module.exports = Editor = (function() {
  function Editor() {}

  Editor.prototype.init = function() {
    return this.addFilesToFs().then((function(_this) {
      return function() {
        return _this.rerender();
      };
    })(this));
  };

  Editor.prototype.rerender = function() {
    var url_file;
    url_file = 'index';
    return this.renderBrowser(jade.renderFile("/" + url_file + ".jade"));
  };

  Editor.prototype.addFilesToFs = function() {
    return this.getFiles().then((function(_this) {
      return function(objs) {
        var dirs, files;
        dirs = _.select(objs, function(file) {
          return file.type === 'tree';
        });
        _.each(dirs, function(dir) {
          return fs.mkdirpSync("/" + dir.path);
        });
        files = _.select(objs, function(obj) {
          return obj.type === 'blob';
        });
        return Promise.all(_this.filesOnlyToFs(files));
      };
    })(this));
  };

  Editor.prototype.filesOnlyToFs = function(files) {
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

  Editor.prototype.renderBrowser = function(content) {
    var new_embed, original_embed, src;
    console.log(this.appendBase(content));
    src = "data:text/html;charset=utf-8," + (encodeURIComponent(this.appendBase(content)));
    original_embed = $('#browser');
    new_embed = original_embed.clone();
    new_embed.prop('src', src);
    return original_embed.replaceWith(new_embed);
  };

  Editor.prototype.appendBase = function(content) {
    var result;
    result = content;
    result = result.replace(/href\=\"/, 'href="http://localhost:9000/');
    return result.replace(/src\=\"/, 'src="http://localhost:9000/');
  };

  Editor.prototype.newContent = function() {
    return "html\n  head\n    title Beautiful Angular\n    link(rel='stylesheet', href='vendor/css/bootstrap.min.css')\n    link(rel='stylesheet', href='css/app.css')\n    script(src='js/app.js')\n  body(ng-app='beautiful')\n    include favicons\n    section(ng-controller='HomeController')\n      h1 {{ heading() }} with something\n      input(type='text', ng-model='name')";
  };

  Editor.prototype.github = function() {
    return new Github({
      token: 'cbd944cd163811f10bb0d3747116e694cab02c07',
      auth: 'oauth'
    });
  };

  Editor.prototype.repo = function() {
    return this.github().getRepo('Nedomas', 'testing-closeheat-angular');
  };

  Editor.prototype.htmlFiles = function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return _this.repo().getTree('master?recursive=true', function(err, contents) {
          var html;
          if (err) {
            return reject(err);
          }
          html = _.select(contents, function(file) {
            return file.path.match(/\.jade$/);
          });
          return resolve(html);
        });
      };
    })(this));
  };

  Editor.prototype.getFiles = function() {
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

  return Editor;

})();
