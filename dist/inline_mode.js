var Filesystem, InlineBrowser, Loader, React, _;

React = require('react/addons');

_ = require('lodash');

InlineBrowser = require('./inline_browser');

Loader = require('./loader');

Filesystem = require('./filesystem');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      build_finished: false
    };
  },
  componentDidMount: function() {
    return this.props.build().then((function(_this) {
      return function(resp) {
        return _this.setState({
          build_finished: true
        });
      };
    })(this))["catch"]((function(_this) {
      return function(err) {
        return _this.props.handleError(err);
      };
    })(this));
  },
  onChange: function(e) {
    if (e.data.action === 'click') {
      return this.changeInHtml(e.data);
    } else if (e.data.action === 'prompt') {
      return this.state.editing_location.element.html(e.data.new_content);
    } else {
      debugger;
    }
  },
  changeInHtml: function(event) {
    var code, location, locations, new_content_code;
    locations = [];
    _.each(this.htmlFiles(), (function(_this) {
      return function(file) {
        var dom, element;
        dom = $('<html>').html(file.content);
        element = dom.find(event.path);
        return locations.push({
          file: file,
          element: element,
          dom: dom
        });
      };
    })(this));
    if (locations.length !== 1) {
      return alert('Cannot edit this element');
    }
    location = locations[0];
    this.setState({
      editing_location: location
    });
    new_content_code = "prompt('', '" + (location.element.html()) + "')";
    code = "parent.postMessage({ action: 'prompt', new_content: " + new_content_code + " }, 'http://localhost:4000')";
    return this.refs.browser.evalInIframe(code);
  },
  htmlFiles: function() {
    return _.select(Filesystem.ls(), function(file) {
      return file.path.match(/\.html$/);
    });
  },
  browser: function() {
    return React.createElement("div", null, React.createElement("div", {
      "className": 'row'
    }, React.createElement("div", {
      "className": 'col browser-col full m12'
    }, React.createElement(InlineBrowser, {
      "ref": 'browser',
      "browser_url": this.props.browser_url,
      "onChange": this.onChange
    }))));
  },
  render: function() {
    if (this.state.build_finished) {
      return this.browser();
    } else {
      return React.createElement(Loader, {
        "title": 'Hang in tight. Building your page preview...'
      });
    }
  }
});
