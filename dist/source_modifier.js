var Filesystem, HTMLModifier, SourceModifier, _;

Filesystem = require('./filesystem');

HTMLModifier = require('./html_modifier');

_ = require('lodash');

module.exports = SourceModifier = (function() {
  function SourceModifier(analysis, new_text) {
    this.analysis = analysis;
    this.new_text = new_text;
    this.source = Filesystem.read(this.analysis.file).content;
  }

  SourceModifier.prototype.replaceAtCoords = function(string, insertion, start, end) {
    return string.substr(0, start) + insertion + string.substr(end);
  };

  SourceModifier.prototype.modifiedFileContent = function() {
    return this.replaceAtCoords(this.source, this.new_text, this.analysis.position.start, this.analysis.position.end);
  };

  SourceModifier.prototype.apply = function() {
    Filesystem.write(this.analysis.file, this.modifiedFileContent());
    return console.log(this.modifiedFileContent());
  };

  return SourceModifier;

})();
