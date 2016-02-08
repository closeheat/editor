var HTMLAnalizer, Parser, _;

_ = require('lodash');

Parser = new DOMParser();

require('string_score');

module.exports = HTMLAnalizer = (function() {
  function HTMLAnalizer(file, event) {
    this.file = file;
    this.event = event;
    this.dom = $(Parser.parseFromString(this.file.content, "text/html"));
    this.selector_parts = this.event.selector.split(' > ');
  }

  HTMLAnalizer.prototype.analize = function() {
    var strongest_combination;
    strongest_combination = this.strongestCombination();
    if (!strongest_combination) {
      return {
        score: 0
      };
    }
    return strongest_combination;
  };

  HTMLAnalizer.prototype.strongestCombination = function() {
    var all_combinations, scored_combinations;
    all_combinations = this.allCombinations();
    if (!all_combinations.length) {
      return;
    }
    scored_combinations = _.map(all_combinations, (function(_this) {
      return function(combination) {
        combination.string_score = _this.stringScore(combination);
        combination.inner_text = combination.element.innerText;
        combination.score = combination.string_score * 0.8 + combination.selector_score * 0.2;
        return combination;
      };
    })(this));
    return _.maxBy(scored_combinations, 'score');
  };

  HTMLAnalizer.prototype.stringScore = function(combination) {
    var max_selector_scale;
    max_selector_scale = 12;
    return _.trim(this.event.inner_text).score(_.trim(combination.element.innerText)) * max_selector_scale;
  };

  HTMLAnalizer.prototype.allCombinations = function() {
    var result;
    result = [];
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
          element: element
        });
      };
    })(this));
    return result;
  };

  return HTMLAnalizer;

})();
