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

  HTMLAnalizer.prototype.analize = function() {
    var strongest_combination;
    if (!this.supportedFile()) {
      return {
        score: 0
      };
    }
    strongest_combination = this.strongestCombination();
    if (!strongest_combination) {
      return {
        score: 0
      };
    }
    return strongest_combination;
  };

  HTMLAnalizer.prototype.supportedFile = function() {
    var SUPPORTED_EXTENSION_REGEX;
    SUPPORTED_EXTENSION_REGEX = /(\.|\/)(html|htm)$/;
    return this.file.path.match(SUPPORTED_EXTENSION_REGEX);
  };

  HTMLAnalizer.prototype.strongestCombination = function() {
    var all_combinations, scored_combinations;
    all_combinations = this.allCombinations();
    if (!all_combinations.length) {
      return;
    }
    scored_combinations = _.map(all_combinations, (function(_this) {
      return function(combination) {
        combination.type = 'html';
        combination.dom = _this.dom;
        combination.string_score = _this.stringScore(combination);
        combination.score = combination.string_score * 0.8 + combination.selector_score * 0.2;
        return combination;
      };
    })(this));
    return _.maxBy(scored_combinations, 'score');
  };

  HTMLAnalizer.prototype.stringScore = function(combination) {
    var max_selector_scale;
    max_selector_scale = 12;
    return _.trim(this.event.text).score(_.trim(combination.text)) * max_selector_scale;
  };

  HTMLAnalizer.prototype.allCombinations = function() {
    var NTH_CHILD_REGEX, bare_selector, result;
    result = [];
    NTH_CHILD_REGEX = /:nth\-child\(\d\)/;
    _.times(this.selector_parts.length + 1, (function(_this) {
      return function(i) {
        var element, selector;
        selector = _.takeRight(_this.selector_parts, i).join(' > ');
        element = _this.dom.find(selector)[0];
        if (!element) {
          return true;
        }
        return result.push({
          selector: selector,
          selector_score: i,
          element: element,
          text: _this.text(element)
        });
      };
    })(this));
    bare_selector = _.last(this.selector_parts).replace(NTH_CHILD_REGEX, '');
    _.each(this.dom.find(bare_selector), (function(_this) {
      return function(element) {
        return result.push({
          selector: bare_selector,
          selector_score: 0.1,
          element: element,
          text: _this.text(element)
        });
      };
    })(this));
    return result;
  };

  HTMLAnalizer.prototype.text = function(target) {
    var WHITESPACE_REGEX, j, len, node, ref, result;
    WHITESPACE_REGEX = /^\s*$/;
    result = [];
    ref = target.childNodes;
    for (j = 0, len = ref.length; j < len; j++) {
      node = ref[j];
      if (node.nodeName === "#text" && !(WHITESPACE_REGEX.test(node.nodeValue))) {
        result.push(node.nodeValue);
      }
    }
    return result[0];
  };

  return HTMLAnalizer;

})();
