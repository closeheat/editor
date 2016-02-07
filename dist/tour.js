var React, Tour;

React = require('react');

module.exports = Tour = React.createClass({
  step1: function() {
    return React.createElement("div", {
      "className": 'closeheat-tour-code-editor'
    }, "Change \"NAME\" to your actual name for the magic to happen");
  },
  step2: function() {
    return React.createElement("div", {
      "className": 'closeheat-tour-preview-button'
    }, "Click \"Preview\" to see your changes");
  },
  step3: function() {
    return React.createElement("div", {
      "className": 'closeheat-tour-deploy-button'
    }, "Click \"Publish\" to make your changes available to public");
  },
  render: function() {
    var step;
    step = this['step' + this.props.step];
    if (step && !this.props.done) {
      return step();
    } else {
      return React.createElement("div", null);
    }
  }
});
