var AttributeReplacer, Filesystem, SourceModifier, TextReplacer, _;

Filesystem = require('./filesystem');

_ = require('lodash');

TextReplacer = (function() {
  function TextReplacer(combination, new_text, source) {
    this.combination = combination;
    this.new_text = new_text;
    this.source = source;
  }

  TextReplacer.prototype.replace = function() {
    if (_.isEmpty(this.combination.content_position)) {
      return this.source;
    }
    return this.replaceAtCoords(this.source, this.new_text, this.combination.content_position.start, this.combination.content_position.end);
  };

  TextReplacer.prototype.replaceAtCoords = function(string, insertion, start, end) {
    return string.substr(0, start) + insertion + string.substr(end);
  };

  return TextReplacer;

})();

AttributeReplacer = (function() {
  function AttributeReplacer(combination, new_attributes, source) {
    this.combination = combination;
    this.new_attributes = new_attributes;
    this.source = source;
  }

  AttributeReplacer.prototype.getAtCoords = function(string, start, end) {
    return string.substr(start, end - start);
  };

  AttributeReplacer.prototype.regex = function(attribute) {
    return new RegExp(new RegExp("(\\s*(?:\\s+" + attribute.name + ")\\s*)").source + /(=\s*")([^"]*)("\s*)/.source);
  };

  AttributeReplacer.prototype.replaceAttribute = function(string, attribute) {
    return string.replace(this.regex(attribute), "$1$2" + attribute.value + "$4");
  };

  AttributeReplacer.prototype.replace = function() {
    var tag;
    tag = this.getAtCoords(this.source, this.combination.start_tag_position.start, this.combination.start_tag_position.end);
    _.each(this.new_attributes, (function(_this) {
      return function(attribute) {
        return tag = _this.replaceAttribute(tag, attribute);
      };
    })(this));
    return this.replaceAtCoords(this.source, tag, this.combination.start_tag_position.start, this.combination.start_tag_position.end);
  };

  AttributeReplacer.prototype.replaceAtCoords = function(string, insertion, start, end) {
    return string.substr(0, start) + insertion + string.substr(end);
  };

  return AttributeReplacer;

})();

module.exports = SourceModifier = (function() {
  function SourceModifier(combination, new_text, new_attributes) {
    this.combination = combination;
    this.new_text = new_text;
    this.new_attributes = new_attributes;
    this.source = Filesystem.read(this.combination.file_path).content;
  }

  SourceModifier.prototype.apply = function() {
    var replaced_attributes, replaced_text;
    replaced_text = new TextReplacer(this.combination, this.new_text, this.source).replace();
    replaced_attributes = new AttributeReplacer(this.combination, this.new_attributes, replaced_text).replace();
    Filesystem.write(this.combination.file_path, replaced_attributes);
    return console.log(replaced_attributes);
  };

  return SourceModifier;

})();
