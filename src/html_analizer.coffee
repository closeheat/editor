_ = require 'lodash'
DOMParser = require('xmldom').DOMParser
Parser = new DOMParser(locator: {}, errorHandler: ->)
# # parse5 = require('parse5')
# # jsdom = require('jsdom')
# whacko = require 'whacko'
# cheerio = require 'cheerio'
# queryDom = require 'query-dom'
require('string_score')

module.exports =
class HTMLAnalizer
  constructor: (@file, @event) ->
    @dom = $(Parser.parseFromString(@file.content, 'text/html'))
    @selector_parts = @event.selector.split(' > ')

  analize: ->
    return { score: 0 } unless @supportedFile()
    strongest_combination = @strongestCombination()
    return { score: 0 } unless strongest_combination

    strongest_combination

  supportedFile: ->
    SUPPORTED_EXTENSION_REGEX = /(\.|\/)(html|htm)$/
    @file.path.match(SUPPORTED_EXTENSION_REGEX)

  strongestCombination: ->
    all_combinations = @allCombinations()
    return unless all_combinations.length

    scored_combinations = _.map all_combinations, (combination) =>
      combination.type = 'html'
      combination.dom = @dom
      combination.string_score = @stringScore(combination)
      combination.score = combination.string_score * 0.8 + combination.selector_score * 0.2
      # console.log @event.text
      # console.log combination.text
      # console.log "SEL: #{combination.selector_score}, STR: #{combination.string_score}, TO: #{combination.score}"
      combination

    _.maxBy scored_combinations, 'score'

  stringScore: (combination) ->
    max_selector_scale = 12
    _.trim(@event.text).score(_.trim(combination.text)) * max_selector_scale

  allCombinations: ->
    result = []
    NTH_CHILD_REGEX = /:nth\-child\(\d\)/

    _.times @selector_parts.length + 1, (i) =>
      selector = _.takeRight(@selector_parts, i).join(' > ')
      element = @dom.find(selector)[0]
      return true unless element

      result.push
        selector: selector
        selector_score: i
        element: element
        text: @text(element)

    bare_selector = _.last(@selector_parts).replace(NTH_CHILD_REGEX, '')
    _.each @dom.find(bare_selector), (element) =>
      result.push
        selector: bare_selector
        selector_score: 0.1
        element: element
        text: @text(element)

    result

  # matching with inject script
  text: (target) ->
    WHITESPACE_REGEX = /^\s*$/

    result = []

    for node in target.childNodes
      if node.nodeName == "#text" && !(WHITESPACE_REGEX.test(node.nodeValue))
        result.push node.nodeValue

    # TODO: handle "hello<a>some</a> super" editing super

    # console.log 'here'
    # console.log node.nodeValue
    # debugger if result[0].toString() == 'true'
    result[0]
    # 'Lenz'
