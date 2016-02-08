var FrontMatterAnalizer, HTMLAnalizer, SourceFinder, _, matter;

_ = require('lodash');

matter = require('gray-matter');

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
    return _.max([file_analysis.html.score, file_analysis.front_matter.score]);
  };

  SourceFinder.prototype.analizedFiles = function() {
    return _.map(this.files, (function(_this) {
      return function(file) {
        var parsed_file;
        parsed_file = matter(file.content);
        return {
          front_matter: new FrontMatterAnalizer(parsed_file.data, _this.event).analize(),
          html: new HTMLAnalizer(parsed_file.content, _this.event).analize(),
          inner_text: _this.event.inner_text,
          file: file.path
        };
      };
    })(this));
  };

  return SourceFinder;

})();
