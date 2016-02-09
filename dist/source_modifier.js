var Filesystem, HTMLModifier, SourceModifier, StringAlter, _,
  slice = [].slice;

Filesystem = require('./filesystem');

_ = require('lodash');

StringAlter = require('string-alter');

module.exports = SourceModifier = (function() {
  function SourceModifier(analysis, new_text) {
    this.analysis = analysis;
    this.new_text = new_text;
    this.source = Filesystem.read(this.analysis.file).content;
  }

  SourceModifier.prototype.apply = function() {
    switch (this.analysis.winner_type) {
      case 'html':
        return new HTMLModifier(this.analysis, this.source, this.new_text).apply();
      case 'front_matter':
        return console.log('fm');
      default:
        return console.log('not implemented');
    }
  };

  return SourceModifier;

})();

HTMLModifier = (function() {
  function HTMLModifier(analysis, source, new_text) {
    this.analysis = analysis;
    this.source = source;
    this.new_text = new_text;
    this.element = this.analysis.html.element;
    this.all_source_lines = this.source.split('\n');
  }

  HTMLModifier.prototype.emptySourceLineCountBeforeTarget = function() {
    return _.countBy(this.all_source_lines.slice(0, +this.element.lineNumber + 1 || 9e9), _.isEmpty)["true"];
  };

  HTMLModifier.prototype.lineNumber = function() {
    return this.element.lineNumber + this.emptySourceLineCountBeforeTarget();
  };

  HTMLModifier.prototype.flatStartColumnNumber = function() {
    var line_length_before, newline_char_before_length_sum;
    line_length_before = _.sumBy(this.all_source_lines.slice(0, this.lineNumber() - 1), function(line) {
      return line.length;
    });
    newline_char_before_length_sum = this.lineNumber() - 1;
    return line_length_before + newline_char_before_length_sum + this.element.columnNumber;
  };

  HTMLModifier.prototype.flatEndColumnNumber = function() {
    return this.flatStartColumnNumber() + this.analysis.text.length;
  };

  HTMLModifier.prototype.replaceAtCoords = function(string, insertion, start, end) {
    return string.substr(0, start) + insertion + string.substr(end);
  };

  HTMLModifier.prototype.target = function() {
    return this.source.substr(this.flatStartColumnNumber(), this.analysis.text.length);
  };

  HTMLModifier.prototype.ensureTargetTextMatches = function() {
    if (this.target() !== this.analysis.text) {
      console.log('NO MATCH');
      console.log(this.target());
      return console.log(this.analysis.text);
    }
  };

  HTMLModifier.prototype.targetCoords = function() {
    return [this.flatStartColumnNumber(), this.flatEndColumnNumber()];
  };

  HTMLModifier.prototype.apply = function() {
    var new_source;
    this.ensureTargetTextMatches();
    new_source = this.replaceAtCoords.apply(this, [this.source, this.new_text].concat(slice.call(this.targetCoords())));
    return console.log(new_source);
  };

  return HTMLModifier;

})();
