var React;

React = require('react/addons');

module.exports = React.createClass({
  checked: function(type) {
    return type === this.props.branch;
  },
  check: function(type) {
    return (function(_this) {
      return function(e) {
        return _this.props.onCheck(type);
      };
    })(this);
  },
  titleChange: function(e) {
    return this.props.onTitleChange(e.target.value);
  },
  title: function() {
    if (this.props.branch !== 'pr') {
      return;
    }
    return React.createElement("div", {
      "className": 'input-field'
    }, React.createElement("input", {
      "id": 'dist-dir',
      "type": 'text',
      "value": this.props.title,
      "onChange": this.titleChange
    }), React.createElement("label", {
      "htmlFor": 'dist-dir'
    }, "Title for a Pull Request"));
  },
  render: function() {
    return React.createElement("div", {
      "className": 'branch-options'
    }, React.createElement("div", null, React.createElement("input", {
      "type": 'radio',
      "id": 'branch-master',
      "checked": this.checked('master'),
      "onChange": this.check('master')
    }), React.createElement("label", {
      "htmlFor": 'branch-master'
    }, "Deploy to website (master branch)")), React.createElement("div", null, React.createElement("input", {
      "type": 'radio',
      "id": 'branch-pr',
      "checked": this.checked('pr'),
      "onChange": this.check('pr')
    }), React.createElement("label", {
      "htmlFor": 'branch-pr'
    }, "Create a Pull Request with changes (create new branch)")), this.title());
  }
});
