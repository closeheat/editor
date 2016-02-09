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

  SourceModifier.prototype.apply = function() {
    var new_source;
    new_source = (function() {
      switch (this.analysis.winner_type) {
        case 'html':
          return new HTMLModifier(this.analysis, this.source, this.new_text).modifiedSource();
        case 'front_matter':
          return console.log('FRONT MATTER NOT IMPLEMENTED YET');
        default:
          return console.log('NOT IMPLEMENTED');
      }
    }).call(this);
    Filesystem.write(this.analysis.file, new_source);
    return console.log(new_source);
  };

  return SourceModifier;

})();
