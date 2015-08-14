var Navigation, React, Router;

React = require('react/addons');

Router = require('react-router');

Navigation = Router.Navigation;

module.exports = React.createClass({
  mixins: [Navigation],
  activeClass: function() {
    var result;
    result = 'tab col m2';
    if (this.props.active) {
      result += ' tab-active';
    }
    return result;
  },
  onClick: function() {
    return this.transitionTo('file', {
      splat: this.props.file.href
    });
  },
  render: function() {
    return React.createElement("tr", {
      "onClick": this.onClick
    }, React.createElement("td", null, this.props.file.type), React.createElement("td", null, this.props.file.name), React.createElement("td", null, this.props.file.type));
  }
});
