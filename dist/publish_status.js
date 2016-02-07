var PublishStatus, React, classNames;

React = require('react');

classNames = require('classnames');

module.exports = PublishStatus = React.createClass({
  currentStage: function() {
    return this.props.current || 0;
  },
  error: function(i) {
    if (!(this.props.error && this.currentStage() === i + 1)) {
      return React.createElement("span", null);
    }
    return React.createElement("div", {
      "className": 'stage-error'
    }, "App name ", this.props.error);
  },
  render: function() {
    if (this.currentStage() === 0) {
      return React.createElement("span", {
        "className": 'deploy-steps'
      });
    }
    return React.createElement("ul", {
      "className": "deploy-steps collection"
    }, _.map(this.props.stages, (function(_this) {
      return function(stage, i) {
        var icon_classes, li_classes;
        li_classes = function(_this) {
          return classNames({
            'collection-item': true,
            success: !_this.props.error && _this.currentStage() > i + 1,
            failure: _this.props.error && _this.currentStage() === i + 1
          });
        };
        icon_classes = function(_this) {
          return classNames({
            fa: true,
            icon: true,
            'secondary-content': true,
            'fa-check-circle': !_this.props.error && _this.currentStage() > i + 1,
            'fa-circle-o-notch fa-spin': !_this.props.error && _this.currentStage() === i + 1,
            'fa-exclamation-circle': _this.props.error && _this.currentStage() === i + 1
          });
        };
        return React.createElement("li", {
          "key": stage,
          "className": li_classes(_this)
        }, React.createElement("span", {
          "className": 'stage-name'
        }, stage), React.createElement("i", {
          "className": icon_classes(_this)
        }), _this.error(i));
      };
    })(this)));
  }
});
