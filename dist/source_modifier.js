var Filesystem, SourceModifier, _;

Filesystem = require('./filesystem');

_ = require('lodash');

module.exports = SourceModifier = (function() {
  function SourceModifier(combination, new_text) {
    this.combination = combination;
    this.new_text = new_text;
    this.source = Filesystem.read(this.combination.file_path).content;
  }

  SourceModifier.prototype.replaceAtCoords = function(string, insertion, start, end) {
    return string.substr(0, start) + insertion + string.substr(end);
  };

  SourceModifier.prototype.modifiedFileContent = function() {
    return this.replaceAtCoords(this.source, this.new_text, this.combination.position.start, this.combination.position.end);
  };

  SourceModifier.prototype.apply = function() {
    Filesystem.write(this.combination.file_path, this.modifiedFileContent());
    return console.log(this.modifiedFileContent());
  };

  return SourceModifier;

})();
