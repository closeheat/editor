_ = require 'lodash'
require('string_score')

module.exports =
class FrontMatterAnalizer
  constructor: (@data, @event) ->
    @inner_text = _.trim(@event.inner_text)

  analize: ->
    text_keys = @textKeys()
    return { score: 0 } unless _.keys(text_keys).length

    result = []

    _.each text_keys, (val, key) =>
      string_score = val.score(@inner_text)

      result.push
        key: key
        val: val
        score: string_score * 10

    _.maxBy(result, 'score')

  textKeys: ->
    _.pickBy @data, _.isString
