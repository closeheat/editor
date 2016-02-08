var React;

React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      selected: 'upload'
    };
  },
  itemClass: function(type) {
    var result;
    result = 'free-hosting-type';
    if (this.state.selected === type) {
      result += ' free-hosting-type-selected';
    }
    return result;
  },
  handleSelect: function(type) {
    return (function(_this) {
      return function() {
        return _this.setState({
          selected: type
        });
      };
    })(this);
  },
  getHref: function() {
    if (this.state.selected === 'upload') {
      return '/apps/new/upload';
    } else {
      return '/apps/new/templates';
    }
  },
  buttonText: function() {
    if (this.state.selected === 'upload') {
      return 'Upload my website';
    } else {
      return 'Get my website';
    }
  },
  maybeClose: function(e) {
    if (e.target.className !== 'free-hosting-container') {
      return;
    }
    return this.props.close();
  },
  render: function() {
    if (!this.props.show) {
      return React.createElement("div", null);
    }
    return React.createElement("div", {
      "className": 'free-hosting-container',
      "onClick": this.maybeClose
    }, React.createElement("div", {
      "className": 'free-hosting center-align'
    }, React.createElement("div", {
      "className": 'row free-hosting-title'
    }, "Create a different website"), React.createElement("div", {
      "className": 'row'
    }, React.createElement("div", {
      "className": 'col s6'
    }, React.createElement("div", {
      "className": this.itemClass('upload'),
      "onClick": this.handleSelect('upload')
    }, React.createElement("div", {
      "className": 'free-hosting-type-icon'
    }, React.createElement("i", {
      "className": 'medium material-icons'
    }, "invert_colors")), React.createElement("div", {
      "className": 'free-hosting-type-title'
    }, "I have a website to upload"))), React.createElement("div", {
      "className": 'col s6'
    }, React.createElement("div", {
      "className": this.itemClass('template'),
      "onClick": this.handleSelect('template')
    }, React.createElement("div", {
      "className": 'free-hosting-type-icon'
    }, React.createElement("i", {
      "className": 'medium material-icons'
    }, "album")), React.createElement("div", {
      "className": 'free-hosting-type-title'
    }, "Use a new template"))), React.createElement("div", {
      "className": 'row'
    }, React.createElement("a", {
      "href": this.getHref(),
      "target": '_blank',
      "className": "btn btn-large waves-effect waves-light free-hosting-button"
    }, this.buttonText())))));
  }
});
