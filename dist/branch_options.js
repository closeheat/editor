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
    }, "Deploy to website immediately")), React.createElement("div", null, React.createElement("input", {
      "type": 'radio',
      "id": 'branch-pr',
      "checked": this.checked('pr'),
      "onChange": this.check('pr')
    }), React.createElement("label", {
      "htmlFor": 'branch-pr'
    }, "Create a Pull Request")));
  }
});
