var FrontMatterAnalizer, HTMLAnalizer, SourceFinder, _;

_ = require('lodash');

HTMLAnalizer = require('./html_analizer');

FrontMatterAnalizer = require('./front_matter_analizer');

module.exports = SourceFinder = (function() {
  function SourceFinder(event, files) {
    this.event = event;
    this.files = files;
  }

  SourceFinder.prototype.source = function() {
    return _.maxBy(this.scores(), 'combined_score');
  };

  SourceFinder.prototype.scores = function() {
    return _.map(this.analizedFiles(), (function(_this) {
      return function(file_analysis) {
        return _.merge({
          combined_score: _this.calculateCombinedScore(file_analysis)
        }, file_analysis);
      };
    })(this));
  };

  SourceFinder.prototype.calculateCombinedScore = function(file_analysis) {
    return file_analysis.html.score;
  };

  SourceFinder.prototype.analizedFiles = function() {
    return _.map(this.files, (function(_this) {
      return function(file) {
        return {
          front_matter: new FrontMatterAnalizer(file, _this.event).analize(),
          html: new HTMLAnalizer(file, _this.event).analize(),
          inner_text: _this.event.inner_text
        };
      };
    })(this));
  };

  return SourceFinder;

})();
