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
    console.log('RUNNER UP');
    console.log(_.first(_.takeRight(_.sortBy(this.scores(), 'winner_score'), 2)));
    return _.maxBy(this.scores(), 'winner_score');
  };

  SourceFinder.prototype.scores = function() {
    return _.map(this.analizedFiles(), (function(_this) {
      return function(file_analysis) {
        var winner;
        winner = _this.chooseWinner(file_analysis);
        return _.merge({
          winner_type: winner.type,
          winner_score: winner.score
        }, file_analysis);
      };
    })(this));
  };

  SourceFinder.prototype.chooseWinner = function(file_analysis) {
    return _.maxBy([file_analysis.html, file_analysis.front_matter], 'score');
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
          html: new HTMLAnalizer(file.content, _this.event).analize(),
          text: _this.event.text,
          file: file.path
        };
      };
    })(this));
  };

  return SourceFinder;

})();
