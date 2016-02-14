var HTMLAnalizer, NodeLocationExtender, SourceFinder, _;

_ = require('lodash');

HTMLAnalizer = require('./html_analizer');

NodeLocationExtender = require('./node_location_extender');

module.exports = SourceFinder = (function() {
  function SourceFinder(event, files) {
    this.event = event;
    this.files = files;
  }

  SourceFinder.prototype.source = function() {
    var sorted_combinations;
    sorted_combinations = _.takeRight(this.sortedCombinatins(), 3);
    if (!sorted_combinations.length) {
      return {};
    }
    console.log(sorted_combinations);
    return new NodeLocationExtender(_.last(sorted_combinations)).extend();
  };

  SourceFinder.prototype.sortedCombinatins = function() {
    return _.sortBy(this.combinations(), 'score');
  };

  SourceFinder.prototype.combinations = function() {
    var result;
    result = _.map(this.files, (function(_this) {
      return function(file) {
        return new HTMLAnalizer(file, _this.event).combinations();
      };
    })(this));
    return _.flatten(result);
  };

  return SourceFinder;

})();
