var NodeLocationExtender, _, jsdom;

jsdom = require('jsdom');

_ = require('lodash');

module.exports = NodeLocationExtender = (function() {
  function NodeLocationExtender(event, combination) {
    this.event = event;
    this.combination = combination;
  }

  NodeLocationExtender.prototype.extend = function() {
    return _.merge(this.combination, this.coords());
  };

  NodeLocationExtender.prototype.coords = function() {
    var content_position, start_tag_position;
    switch (this.combination.type) {
      case 'html':
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
