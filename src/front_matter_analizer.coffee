_ = require 'lodash'
matter = require('gray-matter')
require('string_score')

module.exports =
class FrontMatterAnalizer
  constructor: (file, @event) ->
    @data = matter(file.content).data
    @text = _.trim(@event.text)

  analize: ->
    text_keys = @textKeys()
    return { score: 0 } unless _.keys(text_keys).length

    result = []

    _.each text_keys, (val, key) =>
      string_score = val.score(@text)

      result.push
        type: 'front_matter'
        key: key
        text: val
        score: string_score * 10

    _.maxBy(result, 'score')

  textKeys: ->
    _.pickBy @data, _.isString
