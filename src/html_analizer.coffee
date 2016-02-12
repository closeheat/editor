_ = require 'lodash'
jsdom = require('jsdom')
require('string_score')

module.exports =
class HTMLAnalizer
  constructor: (@file, @event) ->
    return unless @supportedFile()

    vdom = jsdom.jsdom @file.content,
      features:
        FetchExternalResources: false
        ProcessExternalResources: false

    @dom = $(vdom)
    @selector_parts = @event.selector.split(' > ')

  combinations: ->
    return [] unless @supportedFile()

    @scoredCombinations()

  urlFileMatchScore: ->
    max_selector_scale = 12
    @pathname().score(@file.path) * max_selector_scale

  pathname: ->
    return 'index.html' if @event.pathname == '/'

    FIRST_SLASH_REGEX = /^\//
    @event.pathname.replace(FIRST_SLASH_REGEX, '')

  supportedFile: ->
    SUPPORTED_EXTENSION_REGEX = /(\.|\/)(html|htm)$/
    @file.path.match(SUPPORTED_EXTENSION_REGEX)

  scoredCombinations: (all_combinations) ->
    _.map @allCombinations(), (combination) =>
      combination.type = 'html'
      combination.dom = @dom
      combination.string_score = @stringScore(combination)
      combination.url_file_match_score = @urlFileMatchScore()
      combination.score = combination.string_score * 0.8 + combination.selector_score * 0.2 + combination.url_file_match_score * 0.2
      combination.file_path = @file.path
      combination.original_text = @event.text
      combination

  stringScore: (combination) ->
    max_selector_scale = 12
    _.trim(@event.text).score(_.trim(combination.text)) * max_selector_scale

  allCombinations: ->
    result = []
    NTH_CHILD_REGEX = /:nth\-child\(\d\)/

    _.times @selector_parts.length + 1, (i) =>
      selector = _.takeRight(@selector_parts, i).join(' > ')
      selector_element = @dom.find(selector)[0]
      return true unless selector_element

      _.each @nodes(selector_element), (node) ->
        result.push
          selector: selector
          selector_score: i
          selector_element: selector_element
          node: node
          text: node.nodeValue

    bare_selector = _.last(@selector_parts).replace(NTH_CHILD_REGEX, '')
    _.each @dom.find(bare_selector), (selector_element) =>
      _.each @nodes(selector_element), (node) ->
        result.push
          selector: bare_selector
          selector_score: 0.1
          selector_element: selector_element
          node: node
          text: node.nodeValue

    result

  # matching with inject script
  nodes: (target) ->
    WHITESPACE_REGEX = /^\s*$/

    result = []

    for node in target.childNodes
      if node.nodeName == "#text" && !(WHITESPACE_REGEX.test(node.nodeValue))
        result.push node

    result
    # TODO: handle "hello<a>some</a> super" editing super

    # console.log 'here'
    # console.log node.nodeValue
    # debugger if result[0].toString() == 'true'
    # 'Lenz'
