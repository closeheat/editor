var FrontMatterAnalizer, _;

_ = require('lodash');

require('string_score');

module.exports = FrontMatterAnalizer = (function() {
  function FrontMatterAnalizer(data, event) {
    this.data = data;
    this.event = event;
    this.text = _.trim(this.event.text);
  }

  FrontMatterAnalizer.prototype.analize = function() {
    var result, text_keys;
    text_keys = this.textKeys();
    if (!_.keys(text_keys).length) {
      return {
        score: 0
      };
    }
    result = [];
    _.each(text_keys, (function(_this) {
      return function(val, key) {
        var string_score;
        string_score = val.score(_this.text);
        return result.push({
          type: 'front_matter',
          key: key,
          text: val,
          score: string_score * 10
        });
      };
    })(this));
    return _.maxBy(result, 'score');
  };

  FrontMatterAnalizer.prototype.textKeys = function() {
    return _.pickBy(this.data, _.isString);
  };

  return FrontMatterAnalizer;

})();
