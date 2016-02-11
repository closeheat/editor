var HTMLModifier, _;

_ = require('lodash');

module.exports = HTMLModifier = (function() {
  function HTMLModifier(analysis, source, new_text) {
    var NEWLINE_REGEX, matches;
    this.analysis = analysis;
    this.source = source;
    this.new_text = new_text;
    this.element = this.analysis.html.element;
    NEWLINE_REGEX = /(?:\r\n?|\n)/gi;
    this.newlines_data = [];
    while ((matches = NEWLINE_REGEX.exec(this.source)) && matches !== null) {
      this.newlines_data.push({
        index: matches.index,
        last_index: NEWLINE_REGEX.lastIndex,
        after_line_number: this.newlines_data.length + 1
      });
    }
    this.all_source_lines = this.source.split(NEWLINE_REGEX);
  }

  HTMLModifier.prototype.emptySourceLineCountBeforeTarget = function() {
    return _.countBy(this.all_source_lines.slice(0, this.element.lineNumber - 1), _.isEmpty)["true"] || 0;
  };

  HTMLModifier.prototype.lineNumber = function() {
    return this.element.lineNumber + this.emptySourceLineCountBeforeTarget();
  };

  HTMLModifier.prototype.flatStartColumnNumber = function() {
    var line_length_before;
    line_length_before = _.sumBy(this.all_source_lines.slice(0, this.lineNumber() - 1), function(line) {
      return line.length;
    });
    return line_length_before + this.newlineCharBeforeSum() + this.element.columnNumber;
  };

  HTMLModifier.prototype.newlineCharBeforeSum = function() {
    var newline_seperators_before;
    newline_seperators_before = _.filter(this.newlines_data, (function(_this) {
      return function(newline_seperator) {
        return newline_seperator.after_line_number < _this.lineNumber();
      };
    })(this));
    return _.sumBy(newline_seperators_before, function(newline_seperator) {
      return newline_seperator.last_index - newline_seperator.index;
    });
  };

  HTMLModifier.prototype.flatEndColumnNumber = function() {
    return this.flatStartColumnNumber() + this.analysis.text.length;
  };

  HTMLModifier.prototype.target = function() {
    return this.source.substr(this.flatStartColumnNumber(), this.analysis.text.length);
  };

  HTMLModifier.prototype.ensureTargetTextMatches = function() {
    if (this.target() !== this.analysis.text) {
      console.log(this.target());
      console.log(this.analysis.text);
      throw new Error('NO MATCH ^^^^');
    }
  };

  HTMLModifier.prototype.targetCoords = function() {
    return {
      flat_start_column_number: this.flatStartColumnNumber(),
      flat_end_column_number: this.flatEndColumnNumber()
    };
  };

  HTMLModifier.prototype.modifiedSource = function() {
    this.ensureTargetTextMatches();
    return this.targetCoords();
  };

  return HTMLModifier;

})();
