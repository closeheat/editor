_ = require 'lodash'

HTMLAnalizer = require('./html_analizer')
NodeLocationExtender = require('./node_location_extender')
# FrontMatterAnalizer = require('./front_matter_analizer')

module.exports =
class SourceFinder
  constructor: (@event, @files) ->

  source: ->
    sorted_combinations = _.takeRight(@sortedCombinatins(), 3)
    return {} unless sorted_combinations.length

    console.log(sorted_combinations)
    new NodeLocationExtender(_.last(sorted_combinations)).extend()

  sortedCombinatins: ->
    _.sortBy(@combinations(), 'score')

  combinations: ->
    result = _.map @files, (file) =>
      new HTMLAnalizer(file, @event).combinations()

    _.flatten(result)
