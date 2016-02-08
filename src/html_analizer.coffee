_ = require 'lodash'
Parser = new DOMParser()
require('string_score')

module.exports =
class HTMLAnalizer
  constructor: (@file, @event) ->
    @dom = $(Parser.parseFromString(@file.content, "text/html"))
    @selector_parts = @event.selector.split(' > ')

  analize: ->
    strongest_combination = @strongestCombination()
    return { score: 0 } unless strongest_combination

    strongest_combination

  strongestCombination: ->
    all_combinations = @allCombinations()
    return unless all_combinations.length

    scored_combinations = _.map all_combinations, (combination) =>
      combination.string_score = @stringScore(combination)
      combination.inner_text = combination.element.innerText
      combination.score = combination.string_score * 0.8 + combination.selector_score * 0.2
      combination

    _.maxBy scored_combinations, 'score'

  stringScore: (combination) ->
    max_selector_scale = 12
    _.trim(@event.inner_text).score(_.trim(combination.element.innerText)) * max_selector_scale

  allCombinations: ->
    result = []

    _.times @selector_parts.length + 1, (i) =>
      selector = _.takeRight(@selector_parts, i).join(' > ')
      element = @dom.find(selector)[0]
      return true unless element

      result.push
        selector: selector
        selector_score: i
        element: element

    result


      # window.THINGS.push(element_data)
      # console.log combinations.length
      # if combinations.length
      #   console.log combinations
      #   console.log file
      #   console.log '------'
    #   locations.push(_.merge(element_data, event))
    #
    # return unless locations.length
    #
    # window.EV = event
    # console.log event
    # strongest = _.maxBy(locations, 'strength')
    # console.log _.sortBy(locations, 'strength')
    # console.log 'MOST PROBABLE'
    # console.log strongest.file.content
    # console.log "selector: #{strongest.selector}"
    # console.log "original: #{strongest.original_inner_text}"
    # console.log "el: #{strongest.element_inner_text}"
    # console.log "selector strength: #{strongest.selector_strength}"
    # console.log "string score: #{strongest.string_score}"
    # console.log "strength: #{strongest.strength}"
    # console.log "file: #{strongest.file.path}"
