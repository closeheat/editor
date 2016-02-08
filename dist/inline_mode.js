var Filesystem, InlineBrowser, Loader, Prompt, React, SourceFinder, _, editingPrompt, mouseoutCode, mouseoverCode;

React = require('react');

_ = require('lodash');

InlineBrowser = require('./inline_browser');

Prompt = require('./prompt');

Loader = require('./loader');

Filesystem = require('./filesystem');

SourceFinder = require('./source_finder');

editingPrompt = function() {
  return parent.postMessage({
    action: 'prompt',
    new_content: prompt('', 'CONTENT_VALUE')
  }, 'http://localhost:4000');
};

mouseoverCode = function() {
  var element;
  element = document.querySelector('SELECTOR');
  return element.style.outline = '1px solid hsla(225, 7%, 55%, .4)';
};

mouseoutCode = function() {
  var element;
  element = document.querySelector('SELECTOR');
  return element.style.outline = '';
};

module.exports = React.createClass({
  getInitialState: function() {
    return {
      build_finished: false,
      show_prompt: false,
      iframe_scroll_top: 0,
      iframe_scroll_left: 0,
      current_element_data: {}
    };
  },
  componentDidMount: function() {
    return this.build();
  },
  build: function() {
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
  rebuild: function() {
    this.setState({
      build_finished: false
    });
    return this.build();
  },
  onMessage: function(e) {
    if (e.data.action === 'click') {
      console.log(e);
      return this.onClick(e.data);
    } else if (e.data.action === 'prompt') {
      return this.state.editing_location.element.html(e.data.new_content);
    } else if (e.data.action === 'mouseover') {

    } else if (e.data.action === 'mouseout') {

    } else if (e.data.action === 'scroll') {
      return this.onScroll(e.data);
    } else {
      debugger;
    }
  },
  onMouseover: function(event) {
    var code, element_data;
    element_data = this.editableElement(event);
    if (!element_data) {
      return;
    }
    this.setState({
      old_outline: event.old_outline
    });
    code = mouseoverCode.toString().replace('SELECTOR', element_data.selector);
    return this.refs.browser.evalInIframe(code);
  },
  onMouseout: function(event) {
    var code, element_data;
    element_data = this.editableElement(event);
    if (!element_data) {
      return;
    }
    code = mouseoutCode.toString().replace('SELECTOR', element_data.selector);
    return this.refs.browser.evalInIframe(code);
  },
  onClick: function(event) {
    var element_data;
    console.log('cicked');
    element_data = this.editableElement(event);
    if (element_data) {
      return this.setState({
        show_prompt: true,
        current_element_data: element_data
      });
    } else {
      return this.removePrompt();
    }
  },
  removePrompt: function() {
    return this.setState({
      show_prompt: false,
      current_element_data: {}
    });
  },
  editableElement: function(event) {
    var final, locations, strongest;
    locations = [];
    final = new SourceFinder(event, this.htmlFiles()).source();
    console.log(final);
    return;
    window.EV = event;
    console.log(event);
    strongest = _.maxBy(locations, 'strength');
    console.log(_.sortBy(locations, 'strength'));
    console.log('MOST PROBABLE');
    console.log(strongest.file.content);
    console.log("selector: " + strongest.selector);
    console.log("original: " + strongest.original_inner_text);
    console.log("el: " + strongest.element_inner_text);
    console.log("selector strength: " + strongest.selector_strength);
    console.log("string score: " + strongest.string_score);
    console.log("strength: " + strongest.strength);
    return console.log("file: " + strongest.file.path);
  },
  isEditableElement: function(locations) {
    var element;
    if (locations.length !== 1) {
      return;
    }
    element = locations[0].element;
    if (element.children().length !== 0) {
      return;
    }
    if (!element.html()) {
      return;
    }
    return true;
  },
  htmlFiles: function() {
    return _.filter(Filesystem.ls(), function(file) {
      return file.path.match(/\.html$/);
    });
  },
  onScroll: function(data) {
    return this.setState({
      iframe_scroll_top: data.top,
      iframe_scroll_left: data.left
    });
  },
  onSave: function(new_value) {
    var found_element, new_content, new_element_html, old_element_html;
    old_element_html = this.state.current_element_data.element.prop('outerHTML');
    new_element_html = this.state.current_element_data.element.html(new_value).prop('outerHTML');
    found_element = this.state.current_element_data.file.content.match(old_element_html);
    if (!found_element) {
      return alert('Cant find the element in code. Formatting?');
    }
    new_content = this.state.current_element_data.file.content.replace(old_element_html, new_element_html);
    Filesystem.write(this.state.current_element_data.file.path, new_content);
    this.removePrompt();
    return this.rebuild();
  },
  prompt: function() {
    if (!this.state.show_prompt) {
      return React.createElement("div", null);
    }
    return React.createElement(Prompt, {
      "element_data": this.state.current_element_data,
      "iframe_scroll_top": this.state.iframe_scroll_top,
      "iframe_scroll_left": this.state.iframe_scroll_left,
      "onSave": this.onSave
    });
  },
  browser: function() {
    return React.createElement("div", null, React.createElement("div", {
      "className": 'row'
    }, React.createElement("div", {
      "className": 'col browser-col full m12'
    }, React.createElement(InlineBrowser, {
      "ref": 'browser',
      "browser_url": 'http://localhost:9000' || this.props.browser_url,
      "onMessage": this.onMessage
    }))), this.prompt());
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
