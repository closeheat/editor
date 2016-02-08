var Promise, React, request;

React = require('react');

Promise = require('bluebird');

request = require('request');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      dist_dir: this.props.dist_dir,
      slug: this.props.slug
    };
  },
  componentDidMount: function() {
    return this.props.hideChangeDistDirToast();
  },
  changeDistDir: function(e) {
    return this.setState({
      dist_dir: e.target.value
    });
  },
  changeSlug: function(e) {
    return this.setState({
      slug: e.target.value
    });
  },
  saveChanges: function() {
    var jobs;
    this.setState({
      saving: true
    });
    jobs = [];
    if (this.state.dist_dir !== this.props.dist_dir) {
      jobs.push('dist_dir');
    }
    if (this.state.slug !== this.props.slug) {
      jobs.push('slug');
    }
    if (!jobs.length) {
      this.setState({
        saving: false
      });
      return Materialize.toast("Nothing saved. What are you doing?", 4000);
    }
    return Promise.reduce(jobs, (function(_this) {
      return function(total, name) {
        return _this.saveSingle(name);
      };
    })(this), 0).then((function(_this) {
      return function() {
        Materialize.toast("We've got it. New settings were saved.", 4000);
        return _this.setState({
          saving: false
        });
      };
    })(this));
  },
  saveSingle: function(name) {
    if (name === 'dist_dir') {
      return this.props.saveDistDir(this.state.dist_dir);
    } else {
      return this.props.saveSlug(this.state.slug)["catch"]((function(_this) {
        return function(err) {
          if (err === 'invalid_slug') {
            return _this.handleInvalidSlug();
          }
          return _this.props.handleError(err);
        };
      })(this));
    }
  },
  handleInvalidSlug: function() {
    return Materialize.toast("That's a bad subdomain. Letters or dashes only?", 4000);
  },
  render: function() {
    return React.createElement("div", {
      "className": 'settings'
    }, React.createElement("div", {
      "className": 'row'
    }, React.createElement("div", {
      "className": 'settings-container col offset-s4 s4 offset-m3 m6 offset-l4 l4'
    }, React.createElement("div", {
      "className": 'row'
    }, React.createElement("div", {
      "className": 'settings-title'
    }, "Website Settings")), React.createElement("div", {
      "className": 'row'
    }, React.createElement("div", {
      "className": 'input-field settings-slug'
    }, React.createElement("input", {
      "id": 'dist-dir',
      "type": 'text',
      "value": this.state.slug,
      "onChange": this.changeSlug
    }), React.createElement("label", {
      "htmlFor": 'dist-dir',
      "className": 'active'
    }, "Subdomain")), React.createElement("span", {
      "className": 'settings-slug'
    }, ".closeheatapp.com")), React.createElement("div", {
      "className": 'input-field'
    }, React.createElement("input", {
      "id": 'dist-dir',
      "type": 'text',
      "value": this.state.dist_dir,
      "onChange": this.changeDistDir
    }), React.createElement("label", {
      "htmlFor": 'dist-dir',
      "className": 'active'
    }, "Directory to be published")), React.createElement("div", {
      "disabled": this.state.saving,
      "onClick": this.saveChanges,
      "className": "btn btn-large waves-effect waves-light settings-save-changes-button"
    }, (this.state.saving ? 'Saving...' : 'Save Changes')))));
  }
});
