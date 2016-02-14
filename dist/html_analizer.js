var HTMLAnalizer, _, jsdom;

_ = require('lodash');

jsdom = require('jsdom');

require('string_score');

module.exports = HTMLAnalizer = (function() {
  function HTMLAnalizer(file, event) {
    var vdom;
    this.file = file;
    this.event = event;
    if (!this.supportedFile()) {
      return;
    }
    vdom = jsdom.jsdom(this.file.content, {
      features: {
        FetchExternalResources: false,
        ProcessExternalResources: false
      }
    });
    this.dom = $(vdom);
    this.selector_parts = this.event.selector.split(' > ');
  }

  HTMLAnalizer.prototype.combinations = function() {
    if (!this.supportedFile()) {
      return [];
    }
    return this.scoredCombinations();
  };

  HTMLAnalizer.prototype.urlFileMatchScore = function() {
    var max_selector_scale;
    max_selector_scale = 12;
    return this.pathname().score(this.file.path) * max_selector_scale;
  };

  HTMLAnalizer.prototype.pathname = function() {
    var FIRST_SLASH_REGEX;
    if (this.event.pathname === '/') {
      return 'index.html';
    }
    FIRST_SLASH_REGEX = /^\//;
    return this.event.pathname.replace(FIRST_SLASH_REGEX, '');
  };

  HTMLAnalizer.prototype.supportedFile = function() {
    var SUPPORTED_EXTENSION_REGEX;
    SUPPORTED_EXTENSION_REGEX = /(\.|\/)(html|htm)$/;
    return this.file.path.match(SUPPORTED_EXTENSION_REGEX);
  };

  HTMLAnalizer.prototype.scoredCombinations = function(all_combinations) {
    return _.map(this.allCombinations(), (function(_this) {
      return function(combination) {
        combination.type = 'html';
        combination.dom = _this.dom;
        combination.string_score = _this.stringScore(combination);
        combination.url_file_match_score = _this.urlFileMatchScore();
        combination.score = combination.string_score * 0.8 + combination.selector_score * 0.2 + combination.url_file_match_score * 0.2;
        combination.file_path = _this.file.path;
        combination.original_text = _this.event.text;
        return combination;
      };
    })(this));
  };

  HTMLAnalizer.prototype.stringScore = function(combination) {
    var max_selector_scale;
    max_selector_scale = 12;
    return _.trim(this.event.text).score(_.trim(combination.text)) * max_selector_scale;
  };

  HTMLAnalizer.prototype.allCombinations = function() {
    var NTH_CHILD_REGEX, bare_selector, no_selector, no_selector_result, result;
    result = [];
    NTH_CHILD_REGEX = /:nth\-child\(\d\)/;
    _.times(this.selector_parts.length + 1, (function(_this) {
      return function(i) {
        var selector, selector_element;
        selector = _.takeRight(_this.selector_parts, i).join(' > ');
        selector_element = _this.dom.find(selector)[0];
        if (!selector_element) {
          return true;
        }
        return _.each(_this.nodes(selector_element), function(node) {
          return result.push({
            selector: selector,
            selector_score: i,
            selector_element: selector_element,
            node: node,
            text: node.nodeValue
          });
        });
      };
    })(this));
    bare_selector = _.last(this.selector_parts).replace(NTH_CHILD_REGEX, '');
    _.each(this.dom.find(bare_selector), (function(_this) {
      return function(selector_element) {
        return _.each(_this.nodes(selector_element), function(node) {
          return result.push({
            selector: bare_selector,
            selector_score: 0.1,
            selector_element: selector_element,
            node: node,
            text: node.nodeValue
          });
        });
      };
    })(this));
    no_selector = "*:contains('" + (_.trim(this.event.text)) + "')";
    no_selector_result = [];
    _.each(this.dom.find(no_selector), (function(_this) {
      return function(selector_element) {
        return _.each(_this.nodes(selector_element), function(node) {
          return no_selector_result.push({
            selector: no_selector,
            selector_score: 0,
            selector_element: selector_element,
            node: node,
            text: node.nodeValue
          });
        });
      };
    })(this));
    if (no_selector_result.length === 1) {
      result = result.concat(no_selector_result);
    }
    return result;
  };

  HTMLAnalizer.prototype.nodes = function(target) {
    var NO_CONTENT_TAGS, WHITESPACE_REGEX, j, len, node, ref, result;
    WHITESPACE_REGEX = /^\s*$/;
    result = [];
    ref = target.childNodes;
    for (j = 0, len = ref.length; j < len; j++) {
      node = ref[j];
      if (node.nodeName === "#text" && !(WHITESPACE_REGEX.test(node.nodeValue))) {
        result.push(node);
      }
    }
    NO_CONTENT_TAGS = ['INPUT', 'BUTTON', 'IMG'];
    if (_.includes(NO_CONTENT_TAGS, target.nodeName) && !target.childNodes.length) {
      result.push(target);
    }
    return result;
  };

  return HTMLAnalizer;

})();
