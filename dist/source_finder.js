var Filesystem, FrontMatterAnalizer, HTMLAnalizer, HTMLModifier, NodeLocationExtender, SourceFinder, _, jsdom;

_ = require('lodash');

jsdom = require('jsdom');

HTMLAnalizer = require('./html_analizer');

HTMLModifier = require('./html_modifier');

Filesystem = require('./filesystem');

FrontMatterAnalizer = require('./front_matter_analizer');

NodeLocationExtender = (function() {
  function NodeLocationExtender(event, analysis) {
    this.event = event;
    this.analysis = analysis;
  }

  NodeLocationExtender.prototype.extend = function() {
    return _.merge(this.analysis, this.coords());
  };

  NodeLocationExtender.prototype.coords = function() {
    var position;
    switch (this.analysis.winner_type) {
      case 'html':
        position = jsdom.nodeLocation(this.analysis.html.node);
        return {
          position: position
        };
      case 'front_matter':
        return console.log('FRONT MATTER NOT IMPLEMENTED YET');
      default:
        return console.log('NOT IMPLEMENTED');
    }
  };

  return NodeLocationExtender;

})();

module.exports = SourceFinder = (function() {
  function SourceFinder(event, files) {
    this.event = event;
    this.files = files;
  }

  SourceFinder.prototype.source = function() {
    var winner;
    console.log('RUNNER UP');
    console.log(_.first(_.takeRight(_.sortBy(this.scores(), 'winner_score'), 2)));
    winner = _.maxBy(this.scores(), 'winner_score');
    return new NodeLocationExtender(this.event, winner).extend();
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
        return {
          front_matter: new FrontMatterAnalizer(file, _this.event).analize(),
          html: new HTMLAnalizer(file, _this.event).analize(),
          text: _this.event.text,
          file: file.path
        };
      };
    })(this));
  };

  return SourceFinder;

})();
