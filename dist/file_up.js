var Navigation, React, Router;

React = require('react');

Router = require('react-router');

Navigation = Router.Navigation;

module.exports = React.createClass({
  mixins: [Navigation],
  onClick: function() {
    return this.transitionTo('file', {
      splat: this.props.href
    });
  },
  render: function() {
    if (!this.props.show) {
      return React.createElement("tr", null);
    }
    return React.createElement("tr", {
      "onClick": this.onClick
    }, React.createElement("td", null), React.createElement("td", {
      "colSpan": 2
    }, "..."));
  }
});
