var React;

React = require('react/addons');

module.exports = React.createClass({
  render: function() {
    return React.createElement("div", {
      "className": 'published valign-wrapper'
    }, React.createElement("div", {
      "className": 'valign published-container'
    }, React.createElement("div", {
      "className": 'published-icon row center-align'
    }, React.createElement("i", {
      "className": 'material-icons'
    }, "favorite_border")), React.createElement("div", {
      "className": 'row center-align'
    }, React.createElement("div", {
      "className": 'published-title'
    }, React.createElement("div", null, "Phew, everything is great."), React.createElement("div", null, "Your landing page has been published.")), React.createElement("a", {
      "href": this.props.website_url,
      "target": '_blank',
      "className": "btn btn-large waves-effect waves-light published-button"
    }, React.createElement("div", null, "Open my landing page", React.createElement("span", {
      "className": 'published-button-icon'
    }, React.createElement("i", {
      "className": 'material-icons'
    }, "open_in_new"))), React.createElement("div", {
      "className": 'published-button-subtitle'
    }, this.props.website_url.replace('http://', '')))), React.createElement("div", {
      "className": 'row center-align published-hosting'
    }, React.createElement("div", {
      "className": 'published-title'
    }, React.createElement("div", {
      "className": 'published-hosting-title'
    }, "Free stuff"), React.createElement("div", null, "Do you have your other website\'s HTML and CSS files?"), React.createElement("div", null, "For early users we\'re hosting it", React.createElement("span", {
      "className": 'published-hosting-free'
    }, "FREE"), ".")), React.createElement("a", {
      "href": '/apps/new_from_github',
      "target": '_blank',
      "className": "btn btn-small waves-effect waves-light published-hosting-button"
    }, React.createElement("div", null, "I believe - Host my website", React.createElement("span", {
      "className": 'published-button-icon'
    }, React.createElement("i", {
      "className": 'material-icons'
    }, "open_in_new")))))));
  }
});
