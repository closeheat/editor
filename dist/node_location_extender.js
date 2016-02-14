var NodeLocationExtender, _, jsdom;

jsdom = require('jsdom');

_ = require('lodash');

module.exports = NodeLocationExtender = (function() {
  function NodeLocationExtender(combination) {
    this.combination = combination;
  }

  NodeLocationExtender.prototype.extend = function() {
    return _.merge(this.combination, this.coords());
  };

  NodeLocationExtender.prototype.noContentPositions = function() {
    var fixed_positions, start_tag_position;
    start_tag_position = jsdom.nodeLocation(this.combination.node);
    fixed_positions = {
      start: start_tag_position.start,
      end: start_tag_position.end
    };
    return {
      content_position: {},
      start_tag_position: fixed_positions
    };
  };

  NodeLocationExtender.prototype.nestedTagPositions = function() {
    var start_tag_position;
    start_tag_position = jsdom.nodeLocation(this.combination.node).startTag;
    return {
      content_position: {},
      start_tag_position: start_tag_position
    };
  };

  NodeLocationExtender.prototype.coords = function() {
    var NO_CONTENT_TAGS, content_position, start_tag_position;
    switch (this.combination.type) {
      case 'html':
        NO_CONTENT_TAGS = ['INPUT', 'BUTTON', 'IMG'];
        if (this.combination.node.childNodes.length) {
          return this.nestedTagPositions();
        }
        if (_.includes(NO_CONTENT_TAGS, this.combination.node.tagName)) {
          return this.noContentPositions();
        }
        content_position = jsdom.nodeLocation(this.combination.node);
        start_tag_position = jsdom.nodeLocation(this.combination.node.parentElement).startTag;
        return {
          content_position: content_position,
          start_tag_position: start_tag_position
        };
      case 'front_matter':
        console.log('FRONT MATTER NOT IMPLEMENTED YET');
        return {};
      default:
        console.log('NOT IMPLEMENTED');
        return {};
    }
  };

  return NodeLocationExtender;

})();
